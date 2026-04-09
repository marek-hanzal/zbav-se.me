import type { AgentInputItem } from "@openai/agents-core";
import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { Tx } from "@/lib/client/tx";

export namespace AgentHistoryItem {
	export interface Props extends Container.Props {
		item: AgentInputItem;
	}
}

export const AgentHistoryItem: FC<AgentHistoryItem.Props> = ({ item, ui, ...props }) => {
	return match(item)
		.with(
			{
				role: "user",
			},
			(item) => {
				const text = match(item.content)
					.with(P.string, (content) => content)
					.otherwise((content) => JSON.stringify(content, null, 2));

				return (
					<Container
						ui={{
							flow: "horizontal",
							justify: "end",
							...ui,
						}}
						{...props}
					>
						<Container
							ui={{
								tone: "brand",
								theme: "light",
								background: "default",
								shadow: true,
								border: true,
								round: "default",
								inner: "default",
							}}
							className={[
								"max-w-[min(42rem,100%)]",
							]}
						>
							<Markdown>{text}</Markdown>
						</Container>
					</Container>
				);
			},
		)
		.with(
			{
				role: P.union("assistant", "system"),
			},
			(item) => {
				return (
					<Container
						ui={{
							flow: "vertical",
							gap: "xs",
							...ui,
						}}
						{...props}
					>
						{match(item.content)
							.with(P.string, (content) => {
								return <Markdown>{content}</Markdown>;
							})
							.with(P.array(P.any), (content) => {
								return content.map((part) => {
									const key = JSON.stringify(part);

									return match(part)
										.with(
											{
												type: "output_text",
												text: P.string,
											},
											(part) => <Markdown key={key}>{part.text}</Markdown>,
										)
										.with(
											{
												type: "refusal",
												refusal: P.string,
											},
											(part) => <Markdown key={key}>{part.refusal}</Markdown>,
										)
										.otherwise((part) => (
											<pre
												key={key}
												className={
													"whitespace-pre-wrap break-words text-sm opacity-70"
												}
											>
												{JSON.stringify(part, null, 2)}
											</pre>
										));
								});
							})
							.otherwise((content) => (
								<pre
									className={"whitespace-pre-wrap break-words text-sm opacity-70"}
								>
									{JSON.stringify(content, null, 2)}
								</pre>
							))}
					</Container>
				);
			},
		)
		.with(
			{
				type: "reasoning",
			},
			(item) => {
				return (
					<Container
						ui={{
							text: "sm",
							inner: "default",
							opacity: "6",
							...ui,
						}}
						{...props}
					>
						<Tx label={JSON.stringify(item, null, 2)} />
					</Container>
				);
			},
		)
		.with(
			{
				type: P.union(
					"function_call",
					"function_call_result",
					"tool_search_call",
					"tool_search_output",
				),
			},
			(item) => {
				return (
					<Container
						data-ui={"AgentHistoryItem-[RawHistoryTool]"}
						ui={{
							border: true,
							round: "default",
							inner: "default",
							gap: "xs",
							flow: "vertical",
							background: "alt",
							...ui,
						}}
						{...props}
					>
						<div className={"text-xs font-semibold uppercase opacity-60"}>
							<Tx label={item.type} />
						</div>

						<pre className={"whitespace-pre-wrap break-words text-sm"}>
							{JSON.stringify(item, null, 2)}
						</pre>
					</Container>
				);
			},
		)
		.otherwise((item) => {
			return (
				<Container
					ui={{
						...ui,
					}}
					{...props}
				>
					<pre className={"whitespace-pre-wrap break-words text-sm opacity-70"}>
						{JSON.stringify(item, null, 2)}
					</pre>
				</Container>
			);
		});
};
