import { defineConfig } from "orval";

export default defineConfig({
    passman: {
        input: {
            target: "src/api-client/api.openapi.json",
        },
        output: {
            mode: "split",
            target: "src/api-client/api.ts",
            client: "react-query",
            httpClient: "fetch",
            mock: false,
            docs: false,
            prettier: true,
            urlEncodeParameters: true,
            tslint: true,
            tsconfig: "tsconfig.json",
            override: {
                mutator: {
                    path: "./src/lib/custom.fetch.ts",
                    name: "customFetch",
                },
                fetch: {
                    includeHttpResponseReturnType: false,
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                },
            },
        },
    },
});
