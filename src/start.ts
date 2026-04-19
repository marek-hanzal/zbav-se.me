import { createStart } from "@tanstack/react-start";
import { TaggedErrorSerializationAdapter } from "@/lib/common/error";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export const startInstance = createStart(() => ({
	requestMiddleware: [
		withLogMiddleware,
	],
	serializationAdapters: [
		TaggedErrorSerializationAdapter,
	],
}));
