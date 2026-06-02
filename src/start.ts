import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { TaggedErrorSerializationAdapter } from "@/lib/common/error";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
	requestMiddleware: [
		withLogMiddleware,
		csrfMiddleware,
	],
	serializationAdapters: [
		TaggedErrorSerializationAdapter,
	],
}));
