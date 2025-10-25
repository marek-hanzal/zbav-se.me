import { defineConfig } from "orval";

export default defineConfig({
	axios: {
		output: {
			mode: "single",
			target: "src/axios.ts",
			client: "axios-functions",
			mock: false,
			// clean: true,
		},
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	},
	zod: {
		output: {
			mode: "single",
			target: "src/zod.ts",
			client: "zod",
			mock: false,
			// clean: true,
		},
		input: `${process.env.VITE_SERVER_API}/v3/api-docs`,
	},
});
