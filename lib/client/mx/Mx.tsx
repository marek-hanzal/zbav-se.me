import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { Markdown } from "../markdown/Markdown";

export namespace Mx {
	export interface Props extends Markdown.Props {
		label: string | undefined;
		fallback?: string;
	}

	export type PropsEx = Partial<Props>;
}

export const Mx: FC<Mx.Props> = ({ label, fallback, ...props }) => {
	const translator = useTranslator();
	return label ? <Markdown {...props}>{translator.text(label, fallback)}</Markdown> : null;
};
