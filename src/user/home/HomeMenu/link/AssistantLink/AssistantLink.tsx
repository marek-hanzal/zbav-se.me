import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { AiIcon } from "@/lib/client/icon/AiIcon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace AssistantLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const AssistantLink = withFallback(
	({ _suspense, ...props }: AssistantLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open assistant chat"}
				{...uiMenuButton({
					className: [],
				})}
				icon={AiIcon}
				to="/$locale/app/assistant"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					ui: {
						tone: "primary",
						theme: "light",
					},
					className: [],
				})}
				{...uiMenuButton({
					ui: {
						tone: "neutral",
						theme: "light",
					},
					className: [],
				})}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						ui: {
							opacity: "5",
						},
					}}
				>
					<Tx label="Assistant (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<AssistantLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open assistant chat"}
				{...uiMenuButton({
					className: [],
				})}
				icon={AiIcon}
				to="/$locale/app/assistant"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					ui: {
						tone: "primary",
						theme: "light",
					},
					className: [],
				})}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
