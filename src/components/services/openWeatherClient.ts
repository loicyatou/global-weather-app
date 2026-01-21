import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiProblemCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "BAD_REQUEST"
  | "UNKNOWN";

export class ApiClientError extends Error {
  public readonly problem: ApiProblem;

  constructor(problem: ApiProblem) {
    super(problem.message);
    this.name = "ApiClientError";
    this.problem = problem;
  }
}

export type ApiProblem = {
  code: ApiProblemCode;
  message: string;
  status?: number;
  /* Useful for debugging in logs/telemetry if time allows*/
  requestId?: string;
  /* Safe extra info if time allows */
  details?: Record<string, unknown>;
  /* Original error*/
  cause?: unknown;
};

export type ApiClientOptions = {
  baseURL: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
  defaultParams?: AxiosRequestConfig["params"];
  onProblem?: (problem: ApiProblem) => void;
};

export type RequestOptions = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  params?: AxiosRequestConfig["params"];
  timeoutMs?: number;
};

function mapStatusToProblemCode(status?: number): ApiProblemCode {
  if (!status) return "UNKNOWN";
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "UNAUTHORIZED";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}

function isTimeoutError(err: AxiosError): boolean {
  // Axios uses code 'ECONNABORTED' for timeouts
  return err.code === "ECONNABORTED";
}

function toApiProblem(error: unknown): ApiProblem {
  if (!isAxiosError(error)) {
    return {
      code: "UNKNOWN",
      message: "Unexpected error",
      cause: error,
    };
  }

  const err = error as AxiosError<any>;
  const status = err.response?.status;

  // Network errors (no response) are common (offline, DNS, CORS, etc.)
  if (!err.response) {
    return {
      code: isTimeoutError(err) ? "TIMEOUT" : "NETWORK_ERROR",
      message: isTimeoutError(err) ? "Request timed out" : "Network error",
      cause: err,
    };
  }

  //if they return a request ID which they might not
  const requestId =
    (err.response.headers?.["x-request-id"] as string | undefined) ??
    (err.response.headers?.["x-correlation-id"] as string | undefined);

  //extract a safe error message from server payload if time allows
  const serverMessage =
    typeof err.response.data?.message === "string"
      ? err.response.data.message
      : undefined;

  return {
    code: mapStatusToProblemCode(status),
    status,
    requestId,
    message: serverMessage ?? `Request failed (${status})`,
    details:
      err.response.data && typeof err.response.data === "object"
        ? { ...err.response.data }
        : undefined,
    cause: err,
  };
}

export class OpenWeatherClient {
  private readonly axios: AxiosInstance;
  private readonly opts: ApiClientOptions;

  constructor(opts: ApiClientOptions) {
    this.opts = opts;
    this.axios = axios.create({
      baseURL: opts.baseURL,
      timeout: opts.timeoutMs ?? 12_000,
      headers: {
        Accept: "application/json",
        ...(opts.defaultHeaders ?? {}),
      },
    });

    this.axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const problem = toApiProblem(err);
        this.opts.onProblem?.(problem);
        return Promise.reject(new ApiClientError(problem));
      },
    );
  }

  private async request<TResponse>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    const config: AxiosRequestConfig = {
      url: path,
      method,
      data: body,
      params: {
        ...(this.opts.defaultParams ?? {}),
        ...(options.params ?? {}),
      },
      signal: options.signal,
      headers: {
        ...(options.headers ?? {}),
      },
      timeout: options.timeoutMs ?? this.opts.timeoutMs ?? 12_000,
    };

    const res: AxiosResponse<TResponse> =
      await this.axios.request<TResponse>(config);

    return res.data;
  }

  async get<TResponse>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return this.request<TResponse>("GET", path, undefined, options);
  }
}
