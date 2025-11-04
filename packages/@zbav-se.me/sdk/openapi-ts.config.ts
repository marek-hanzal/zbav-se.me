import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig([
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
		output: {
			path: "src/session",
			format: "biome",
			lint: "biome",
		},
		parser: {
			filters: {
				tags: {
					include: [
						"session",
					],
				},
			},
		},
		plugins: [
			{
				name: "@hey-api/client-fetch",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../session.client.config",
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
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
		output: {
			path: "src/public",
			format: "biome",
			lint: "biome",
		},
		parser: {
			filters: {
				tags: {
					include: [
						"public",
					],
				},
			},
		},
		plugins: [
			{
				name: "@hey-api/client-fetch",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../public.client.config",
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
	},
]);
