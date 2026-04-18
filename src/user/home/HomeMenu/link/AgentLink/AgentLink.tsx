import { withFallback } from "@/lib/client/fallback";
import { AiIcon, ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace AgentLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const AgentLink = withFallback(
	({ _suspense, ...props }: AgentLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open agent chat"}
				{...uiMenuButton({})}
				icon={AiIcon}
				to="/$locale/app/agent"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButton({
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
				})}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Tx label="Agent (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<AgentLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open agent chat"}
				{...uiMenuButton({})}
				icon={AiIcon}
				to="/$locale/app/agent"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
