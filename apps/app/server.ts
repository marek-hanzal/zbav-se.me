import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("reflect-metadata");

const { createStartHandler, defaultStreamHandler } = await import("@tanstack/react-start/server");

const fetch = createStartHandler(defaultStreamHandler);

export default {
	fetch,
};
