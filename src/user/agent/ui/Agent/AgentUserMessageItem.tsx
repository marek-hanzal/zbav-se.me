import type { UserMessageItem } from "@openai/agents-core";
import type { FC, ReactNode } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";

export namespace AgentUserMessageItem {
	export interface Props extends Container.Props {
		item: UserMessageItem;
	}
}

export const AgentUserMessageItem: FC<AgentUserMessageItem.Props> = ({ item, ui, ...props }) => {
	const parts = getParts(item);

	return (
		<Container
			data-ui={"AgentUserMessageItem"}
			ui={{
				flow: "horizontal",
				justify: "end",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"AgentUserMessageItem[Bubble]"}
				ui={{
					tone: "brand",
					theme: "light",
					background: "default",
					shadow: true,
					border: true,
					round: "default",
					inner: "default",
					flow: "vertical",
					gap: "xs",
				}}
				className={[
					"max-w-[min(42rem,100%)]",
				]}
			>
				{parts}
			</Container>
		</Container>
	);
};

const getParts = (item: UserMessageItem): ReactNode[] => {
	return match(item.content)
		.with(P.string, (content) => [
			<Markdown key={"text"}>{content}</Markdown>,
		])
		.with(P.array(P.any), (content) => {
			const keyMap = new Map<string, number>();

			return content.map((part) => {
				const key = getKey({
					keyMap,
					value: part,
				});

				return match(part)
					.with(
						{
							type: "input_text",
							text: P.string,
						},
						(part) => <Markdown key={key}>{part.text}</Markdown>,
					)
					.otherwise((part) => (
						<pre
							key={key}
							className={"whitespace-pre-wrap break-words text-sm opacity-70"}
						>
							{JSON.stringify(part, null, 2)}
						</pre>
					));
			});
		})
		.exhaustive();
};

const getKey = ({ keyMap, value }: { keyMap: Map<string, number>; value: unknown }): string => {
	const base = JSON.stringify(value);
	const count = keyMap.get(base) ?? 0;

	keyMap.set(base, count + 1);

	return `${base}-${count}`;
};
