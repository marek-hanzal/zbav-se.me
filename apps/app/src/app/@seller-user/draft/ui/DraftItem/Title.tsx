import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace Title {
	export interface Props {
		title: string | null;
	}
}

export const Title: FC<Title.Props> = ({ title }) => {
	return (
		<Tx
			label={title ?? "Draft (label)"}
			ui={{
				tone: title ? "primary" : "neutral",
				theme: "light",
				color: "lead",
				font: "semibold",
				text: "sm",
				display: "block",
				width: "full",
				truncate: true,
			}}
			className={[
				"block",
				"w-full",
				"max-w-full",
				"min-w-0",
			]}
		/>
	);
};
