import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import type { useAgentMessageMutation } from "~/user/agent/mutation/useAgentMessageMutation";
import { AgentRunEvent } from "./AgentRunEvent";

export namespace AgentRun {
	export interface Props extends Container.Props {
		run: useAgentMessageMutation.Run;
	}
}

export const AgentRun: FC<AgentRun.Props> = ({ run, ui, ...props }) => {
	return (
		<Container
			ui={{
				flow: "vertical",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					flow: "horizontal",
					justify: "end",
				}}
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
					<Markdown>{run.userText}</Markdown>
				</Container>
			</Container>

			<Container
				ui={{
					flow: "vertical",
					gap: "xs",
				}}
			>
				{run.events.map((event) => {
					const key = JSON.stringify(event);

					return (
						<AgentRunEvent
							key={`${run.id}-event-${key}`}
							event={event}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
