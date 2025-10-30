import { defineConfig } from "orval";

export default defineConfig({
	axios: {
		output: {
			mode: "single",
			target: "src/axios/axios.ts",
			schemas: "src/schema",
			client: "axios-functions",
			namingConvention: "PascalCase",
			biome: true,
			headers: true,
		},
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	},
	zod: {
		output: {
			mode: "single",
			target: "src/zod/zod.ts",
			namingConvention: "PascalCase",
			client: "zod",
			biome: true,
			clean: true,
			override: {
				zod: {
					generate: {
						body: true,
						header: true,
						param: true,
						query: true,
						response: true,
					},
					coerce: {
						body: true,
						header: true,
						param: true,
						query: true,
						response: true,
					},
				},
			},
		},
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	},
	// https://orval.dev/guides/mcp
	// mcp: {
	// 	output: {
	// 		mode: "single",
	// 		client: "mcp",
	// 		// baseUrl: "https://petstore3.swagger.io/api/v3",
	// 		target: "src/mcp/index.ts",
	// 		schemas: "src/mcp/schemas",
	// 	},
	// 	input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	// },
});
