import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { MessagePackageDbSchema } from "~/app/message-package/schema/MessagePackageDbSchema";

export const MessagePackageSchema = z
	.looseObject({
		...MessagePackageDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "package" => t === "package", {
			message: `Expected "package"`,
		}),
		direction: MessageDirectionEnumSchema,
	})
	.omit({
		userId: true,
		messageThreadId: true,
	})
	.strip()
	.openapi("MessagePackage", {
		description: "Message package entry",
	});

export type MessagePackageSchema = typeof MessagePackageSchema;

export namespace MessagePackageSchema {
	export type Type = z.infer<MessagePackageSchema>;
}
