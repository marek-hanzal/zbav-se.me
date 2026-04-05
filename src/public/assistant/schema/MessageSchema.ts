import { z } from "zod";
import { ChatPartSchema } from "./ChatPartSchema";
import { RoleEnumSchema } from "./RoleEnumSchema";

export const MessageSchema = z
	.looseObject({
		id: z.string().optional(),
		role: RoleEnumSchema,
		parts: z.array(ChatPartSchema),
	})
	.strip();

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
