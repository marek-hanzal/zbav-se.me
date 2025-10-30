import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	output: {
		path: "src/sdk",
		format: "biome",
		lint: "biome",
	},
	plugins: [
		{
			name: "@hey-api/client-fetch",
			exportFromIndex: true,
			baseUrl: false,
			runtimeConfigPath: "../client.config",
		},
		{
			name: "zod",
			requests: {
				types: {
					infer: {
						name: "z{{name}}Request",
					},
				},
			},
			responses: {
				types: {
					infer: {
						name: "z{{name}}Response",
					},
				},
			},
			metadata: true,
			definitions: {
				types: {
					infer: {
						name: "z{{name}}",
					},
				},
			},
			comments: true,
			compatibilityVersion: 4,
			dates: {
				local: false,
				offset: false,
			},
			types: {
				infer: {
					case: "preserve",
				},
			},
			exportFromIndex: true,
		},
		{
			name: "@hey-api/typescript",
			validator: true,
			case: "camelCase",
			requests: {
				name: "t{{name}}Request",
			},
			responses: {
				name: "t{{name}}Response",
			},
			definitions: {
				name: "t{{name}}",
			},
			enums: {
				case: "preserve",
				mode: "javascript",
				// constantsIgnoreNull,
			},
		},
		{
			name: "@hey-api/schemas",
			type: "form",
			nameBuilder: "s{{name}}",
			exportFromIndex: true,
		},
		{
			name: "@hey-api/sdk",
			validator: true,
			exportFromIndex: true,
		},
	],
});
