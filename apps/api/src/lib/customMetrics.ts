import { meter } from "./otel";

// 1. Histogram: Track request duration in seconds
export const requestDurationHistogram = meter.createHistogram(
    "http_request_duration_seconds",
    {
        description: "Histogram of HTTP request duration",
        unit: "seconds",
    }
);

// 2. Summary: Percentile-based request duration
export const requestDurationSummary = meter.createHistogram(
    "http_request_duration_summary",
    {
        description: "Summary of request duration with percentiles",
        unit: "seconds",
    }
);

// 3. Counter: Total HTTP requests
export const requestCounter = meter.createCounter("http_requests_total", {
    description: "Total number of HTTP requests",
});

// 4. Histogram: Request payload size
export const requestSizeHistogram = meter.createHistogram(
    "http_request_size_bytes",
    {
        description: "Size of incoming HTTP requests",
        unit: "bytes",
    }
);

// 5. Histogram: Response payload size
export const responseSizeHistogram = meter.createHistogram(
    "http_response_size_bytes",
    {
        description: "Size of outgoing HTTP responses",
        unit: "bytes",
    }
);

// 6. UpDownCounter: Track active requests
export const activeRequests = meter.createUpDownCounter(
    "http_active_requests",
    {
        description: "Number of currently active requests",
    }
);
