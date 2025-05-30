const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const nodeAutoInstrumentations = getNodeAutoInstrumentations({});

import { credentials } from "@grpc/grpc-js";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import {
    MeterProvider,
    PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import appPackage from "../../package.json";
import env from "./env";

const { default: fastifyOtel } = require("@fastify/otel");
const fastifyOtelInstrumentation = new fastifyOtel.FastifyOtelInstrumentation({
    registerOnInitialization: true,
    enabled: env.TELEMETRY_ENABLED === "true",
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); //enable for logging otel network calls

// OTLP Trace Exporter (for traces)
const traceExporter = new OTLPTraceExporter({
    url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
    credentials: credentials.createInsecure(),
});

const metricExporter = new OTLPMetricExporter({
    url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
    credentials: credentials.createInsecure(),
});

// OTLP Metric Exporter (for metrics)
const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000, // Export every 5 seconds
});

// OTLP Log exporter (for logs)
const logExporter = new OTLPLogExporter({
    url: env.OTLP_COLLECTOR_URL,
    credentials: credentials.createInsecure(),
});

const logProcessor = new BatchLogRecordProcessor(logExporter);

const meterProvider = new MeterProvider({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: appPackage.name,
        [ATTR_SERVICE_VERSION]: appPackage.version,
    }),
    readers: [
        new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 5000,
        }),
    ],
});

export const meter = meterProvider.getMeter("fastify-metrics");

fastifyOtelInstrumentation.setMeterProvider(meterProvider);

// OpenTelemetry SDK setup
const sdk = new NodeSDK({
    instrumentations: [nodeAutoInstrumentations, fastifyOtelInstrumentation],
    resource: new Resource({
        [ATTR_SERVICE_NAME]: appPackage.name,
        [ATTR_SERVICE_VERSION]: appPackage.version,
    }),
    traceExporter: traceExporter,
    metricReader: metricReader,
    logRecordProcessors: [logProcessor],
});

export default sdk;
