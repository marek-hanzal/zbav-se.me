import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace FeedLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const FeedLink = withFallback(
	({ _suspense, ...props }: FeedLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open feed list"}
				{...uiMenuButton({})}
				icon={"icon-[solar--archive-up-minimlistic-linear]"}
				to="/$locale/app/buyer/feed/list"
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
					<Tx label="Feed (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<FeedLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open feed list"}
				{...uiMenuButton({})}
				icon={"icon-[solar--archive-up-minimlistic-linear]"}
				to="/$locale/app/buyer/feed/list"
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
