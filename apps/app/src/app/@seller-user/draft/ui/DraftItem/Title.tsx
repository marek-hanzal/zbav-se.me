import { Tx } from "@use-pico/client/ui/tx";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";

export namespace Title {
	export interface Props {
		title: tDraft["title"];
	}
}

export const Title: FC<Title.Props> = ({ title }) => {
	return (
		<Tx
			label={title ?? "Draft (label)"}
			ui={{
				tone: title ? "brand" : "neutral",
				theme: "light",
				color: "lead",
				font: "semibold",
				text: "md",
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
