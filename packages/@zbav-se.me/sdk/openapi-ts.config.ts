import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	output: {
		path: "src",
		format: "biome",
		lint: "biome",
	},
	plugins: [
		{
			name: "@hey-api/client-axios",
			exportFromIndex: true,
		},
		{
			name: "zod",
			requests: true,
			responses: true,
			metadata: true,
			definitions: true,
			comments: true,
			compatibilityVersion: 4,
			dates: {
				local: false,
				offset: false,
			},
			types: {
				infer: true,
			},
			exportFromIndex: true,
		},
		{
			name: "@hey-api/sdk",
			validator: true,
			exportFromIndex: true,
		},
	],
});
