import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";

export namespace FeedLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const FeedLink = withFallback(({ _suspense, ...props }: FeedLink.Props) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"open feed list"}
			{...uiMenuButton({
				className: [],
			})}
			icon={"icon-[solar--archive-up-minimlistic-linear]"}
			to="/$locale/buyer/feed/list"
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
				<Tx label="Feed (label)" />
			</TypoIcon>
		</LinkTo>
	);
}, (props: Omit<FeedLink.Props, "_suspense">) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"open feed list"}
			{...uiMenuButton({
				className: [],
			})}
			icon={"icon-[solar--archive-up-minimlistic-linear]"}
			to="/$locale/buyer/feed/list"
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
});
