import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";

export namespace AgentRawItem {
	export interface Props extends Container.Props {
		item: unknown;
	}
}

export const AgentRawItem: FC<AgentRawItem.Props> = ({ item, ui, ...props }) => {
	const label = match(item)
		.with(
			{
				type: P.string,
			},
			(item) => item.type,
		)
		.otherwise(() => "raw");

	return (
		<Container
			data-ui={"AgentRawItem"}
			ui={{
				border: true,
				round: "default",
				inner: "default",
				background: "alt",
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			className={[
				"max-w-[min(48rem,100%)]",
			]}
			{...props}
		>
			<div className={"text-xs font-semibold uppercase opacity-60"}>{label}</div>

			<pre className={"whitespace-pre-wrap break-words text-sm opacity-70"}>
				{JSON.stringify(item, null, 2)}
			</pre>
		</Container>
	);
};
