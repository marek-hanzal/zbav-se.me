import { defineConfig } from "@hey-api/openapi-ts";

const common = {
	plugins: [
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
			baseUrl: false,
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
} as const;

export default defineConfig([
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/session`,
		output: {
			path: "src/api/session",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../session.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/user`,
		output: {
			path: "src/api/user",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../user.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/public`,
		output: {
			path: "src/api/public",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../public.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/seller-user`,
		output: {
			path: "src/api/seller-user",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../seller-user.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/seller-session`,
		output: {
			path: "src/api/seller-session",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../seller-session.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/buyer-user`,
		output: {
			path: "src/api/buyer-user",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../buyer-user.client.config",
			},
			...common.plugins,
		],
	},
	{
		input: `${process.env.VITE_SERVER_API}/v3/api-docs/buyer-session`,
		output: {
			path: "src/api/buyer-session",
			format: "biome",
			lint: "biome",
		},
		...common,
		plugins: [
			{
				name: "@hey-api/client-axios",
				exportFromIndex: true,
				baseUrl: false,
				runtimeConfigPath: "../buyer-session.client.config",
			},
			...common.plugins,
		],
	},
]);
