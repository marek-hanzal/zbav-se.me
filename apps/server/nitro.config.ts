import { fileURLToPath } from "node:url";
import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
	alias: {
		"~": fileURLToPath(new URL("./src", import.meta.url)),
	},
	compatibilityDate: "latest",
	preset: "vercel",
	serverDir: "src",
	serverEntry: "./src/server.ts",
});
