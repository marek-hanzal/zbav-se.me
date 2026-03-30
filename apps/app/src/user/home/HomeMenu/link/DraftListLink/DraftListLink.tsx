import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFallback } from "@use-pico/client/utils";
import { ChevronRightIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { DraftIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace DraftListLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const DraftListLink = withFallback(
	({ _suspense, ...props }: DraftListLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open draft list"}
				{...uiMenuButton({
					className: [],
				})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
					<Tx label={"Draft list (label)"} />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<DraftListLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open draft list"}
				{...uiMenuButton({
					className: [],
				})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
