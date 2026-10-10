import type { RunStreamEvent } from "@openai/agents-core";
import { type FC, useEffect, useMemo, useState } from "react";
import { listFn } from "~/random/fn/listFn";
import { rangedomFn } from "~/random/fn/rangedomFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import { getResponseStreamEventFn } from "~/user-agent/fn/getResponseStreamEventFn";

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
			translator.textFn("Agent reasoning 01"),
			translator.textFn("Agent reasoning 02"),
			translator.textFn("Agent reasoning 03"),
			translator.textFn("Agent reasoning 04"),
			translator.textFn("Agent reasoning 05"),
			translator.textFn("Agent reasoning 06"),
			translator.textFn("Agent reasoning 07"),
			translator.textFn("Agent reasoning 08"),
		];
	}, [
		translator,
	]);

	const [reasoningText, setReasoningTextFn] = useState(listFn(text));

	useEffect(() => {
		const runFn = () => {
			setReasoningTextFn(listFn(text));
			return setTimeout(() => runFn(), rangedomFn(2_500, 5_000));
		};

		const timeout = runFn();

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
					label={translator.textFn("Agent reasoning")}
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
			const responseEvent = getResponseStreamEventFn(event);

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
