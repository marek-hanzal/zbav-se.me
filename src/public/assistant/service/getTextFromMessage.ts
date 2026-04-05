import { TextPartSchema } from "~/public/assistant/schema/part/TextPartSchema";
import { MessageSchema } from "../schema/MessageSchema";

export const getTextFromMessage = (input: unknown) => {
	const result = MessageSchema.safeParse(input);
	if (!result.success) {
		return undefined;
	}

	return result.data.parts
		.filter((part): part is TextPartSchema.Type => {
			return TextPartSchema.safeParse(part).success;
		})
		.map((part) => part.text)
		.join("");
};
