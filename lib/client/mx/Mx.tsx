import type { FC } from "react";
import { translator } from "@/lib/common/translation";
import { Markdown } from "../markdown/Markdown";

export namespace Mx {
	export interface Props extends Markdown.Props {
		label: string | undefined;
		fallback?: string;
	}

	export type PropsEx = Partial<Props>;
}

export const Mx: FC<Mx.Props> = ({ label, fallback, ...props }) => {
	return label ? <Markdown {...props}>{translator.text(label, fallback)}</Markdown> : null;
};
