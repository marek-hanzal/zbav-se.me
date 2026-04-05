import { TextPartSchema } from "~/public/assistant/schema/part/TextPartSchema";
import type { MessageSchema } from "../schema/MessageSchema";

export const getTextFromMessage = <const TMessages extends Pick<MessageSchema.Type, "parts">>(
	message: TMessages,
) => {
	return message.parts
		.filter((part): part is TextPartSchema.Type => {
			return TextPartSchema.safeParse(part).success;
		})
		.map((part) => part.text)
		.join("");
};
