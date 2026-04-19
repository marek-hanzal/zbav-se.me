import type { FC } from "react";
import { Markdown } from "@/lib/client/markdown";

export namespace MessageTextContent {
	export interface Props {
		text: string;
	}
}

export const MessageTextContent: FC<MessageTextContent.Props> = ({ text }) => {
	const value = text.trim();

	if (!value.length) {
		return null;
	}

	return <Markdown>{value}</Markdown>;
};
