import type { RunStreamEvent } from "@openai/agents-core";
import { type FC, useEffect, useMemo, useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { list, rangedom } from "@/lib/common/rangedom";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace Reasoning {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
		itemId: string;
		inline: boolean;
	}
}

export const Reasoning: FC<Reasoning.Props> = ({ events, itemId, inline, className, ...props }) => {
	const translator = useTranslator();
	const content = useReasoningContent(events, itemId);

	const text = useMemo(() => {
		return [
			translator.text("Agent reasoning 01"),
			translator.text("Agent reasoning 02"),
			translator.text("Agent reasoning 03"),
			translator.text("Agent reasoning 04"),
			translator.text("Agent reasoning 05"),
			translator.text("Agent reasoning 06"),
			translator.text("Agent reasoning 07"),
			translator.text("Agent reasoning 08"),
		];
	}, [
		translator,
	]);

	const [reasoningText, setReasoningText] = useState(list(text));

	useEffect(() => {
		const run = () => {
			setReasoningText(list(text));
			return setTimeout(() => run(), rangedom(2_500, 5_000));
		};

		const timeout = run();

		return () => {
			clearTimeout(timeout);
		};
	}, [
		text,
	]);

	if (inline) {
		return (
			<Group
				data-ui={"Reasoning"}
				data-id={itemId}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				data-ui-inner="default"
				{...props}
			>
				<Container
					data-ui-flow={"horizontal"}
					data-ui-gap={"default"}
					data-ui-items={"center"}
				>
					<Typo
						label={reasoningText}
						data-ui-text="sm"
						data-ui-font="bold"
						className={[
							"wrap-break-word",
						]}
					/>

					<SpinnerContainer
						data-ui-tone={"neutral"}
						type={"icon"}
						data-ui-text={"default"}
					/>
				</Container>
			</Group>
		);
	}

	return (
		<Group
			data-ui={"Reasoning"}
			data-id={itemId}
			data-output-id={itemId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			className={className}
			{...props}
		>
			<Container
				data-ui-flow="vertical"
				data-ui-gap="xs"
				className={[
					"min-w-0",
				]}
			>
				<Typo
					label={translator.text("Agent reasoning")}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>

				{content.length > 0 ? (
					<Typo
						label={content}
						data-ui-text="xs"
						data-ui-opacity="8"
						className={[
							"wrap-break-word",
							"whitespace-pre-wrap",
						]}
					/>
				) : null}
			</Container>
		</Group>
	);
};

function useReasoningContent(events: RunStreamEvent[] | undefined = [], itemId: string) {
	return useMemo(() => {
		let content = "";

		for (const event of events) {
			const responseEvent = getResponseStreamEvent(event);

			if (
				!responseEvent ||
				!("item_id" in responseEvent) ||
				responseEvent.item_id !== itemId
			) {
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.delta") {
				content += responseEvent.delta;
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.done") {
				content = responseEvent.text;
			}
		}

		return content.trim();
	}, [
		events,
		itemId,
	]);
}
