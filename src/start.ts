import { createStart } from "@tanstack/react-start";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export const startInstance = createStart(() => ({
	requestMiddleware: [
		withLogMiddleware,
	],
}));
