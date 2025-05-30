import { fastifyBasicAuth } from "@fastify/basic-auth";
import fastifySwagger from "@fastify/swagger";
import fastifyPlugin from "fastify-plugin";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

import env from "../lib/env";
import { swaggerOptions } from "../utils/swagger";

export default fastifyPlugin(async (fastify, _opts) => {
    fastify.register(fastifySwagger, swaggerOptions);

    // Register fastify-basic-auth plugin for basic authentication
    fastify.register(fastifyBasicAuth, {
        validate(username, password, _req, _reply, done) {
            if (
                compare(username, env.DOC_USERNAME) &&
                compare(password, env.DOC_PASSWORD)
            ) {
                done(); // Access granted
            } else {
                done(new Error("Invalid credentials"));
            }
        },
        authenticate: true, // Enforce authentication on routes
    });

    const { default: ScalarApiReference } = await import(
        "@scalar/fastify-api-reference"
    );
    fastify.register(ScalarApiReference, {
        routePrefix: "/",
        hooks: {
            onRequest: (request, reply, done) => {
                if (env.NODE_ENV === "production") {
                    fastify.basicAuth(request, reply, done);
                }
                done();
            },
        },
        configuration: {
            hideClientButton: false,
            // layout: "default",
            metaData: {
                title: "Passman Docs",
                description: "API documentation of Passman",
                ogDescription: "API documentation of Passman",
                ogTitle: "Passman Docs",
                ogImage:
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1N2UzODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1maWxlLWNvZGUiPjxwYXRoIGQ9Ik0xMCAxMi41IDggMTVsMiAyLjUiLz48cGF0aCBkPSJtMTQgMTIuNSAyIDIuNS0yIDIuNSIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3eiIvPjwvc3ZnPg==",
                twitterCard: "summary_large_image",
                // Add more...
            },
            // defaultHttpClient: {
            //   targetKey: "javascript",
            //   clientKey: "fetch",
            // },
            theme: "fastify", // alternate, default, moon, purple, solarized, bluePlanet, saturn, kepler, mars, deepSpace, none
            hideDownloadButton: false,
            favicon:
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1N2UzODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1maWxlLWNvZGUiPjxwYXRoIGQ9Ik0xMCAxMi41IDggMTVsMiAyLjUiLz48cGF0aCBkPSJtMTQgMTIuNSAyIDIuNS0yIDIuNSIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3eiIvPjwvc3ZnPg==",
        },
    });
});

function compare(a: string, b: string): boolean {
    try {
        return timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
        return false;
    }
}
