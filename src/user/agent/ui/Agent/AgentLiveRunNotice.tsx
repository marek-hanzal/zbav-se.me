import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { translator } from "@/lib/common/translator";
import type { agentLiveStreamCache } from "~/user/agent/fn/agentLiveStreamCache";

export namespace AgentLiveRunNotice {
	export interface Props extends Container.Props {
		kind: agentLiveStreamCache.NoticeKind;
	}
}

export const AgentLiveRunNotice: FC<AgentLiveRunNotice.Props> = ({ kind, ui, ...props }) => {
	return (
		<Container
			data-ui={"AgentLiveRunNotice"}
			ui={{
				flow: "horizontal",
				justify: "start",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"AgentLiveRunNotice[Card]"}
				ui={{
					background: "alt",
					border: true,
					round: "default",
					inner: "default",
					text: "sm",
					opacity: "7",
				}}
				className={[
					"max-w-[min(42rem,100%)]",
				]}
			>
				{getNoticeText(kind)}
			</Container>
		</Container>
	);
};

const getNoticeText = (kind: agentLiveStreamCache.NoticeKind): string => {
	return match(kind)
		.with("cancelled", () =>
			translator.text("Agent live run cancelled (notice)", "Run interrupted by user"),
		)
		.with("failed", () => translator.text("Agent live run failed (notice)", "Run failed"))
		.with("incomplete", () =>
			translator.text("Agent live run incomplete (notice)", "Run ended before completion"),
		)
		.exhaustive();
};
