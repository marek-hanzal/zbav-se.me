import { useLocale } from "@use-pico/client/hook";
import { CartIcon, ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace ListingsLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const ListingsLink = withFallback(
	({ _suspense, ...props }: ListingsLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open listings"}
				{...uiMenuButton({
					className: [],
				})}
				icon={CartIcon}
				to="/$locale/app/buyer/feed/default"
				params={{
					locale,
				}}
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
					<Tx label="Listings (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<ListingsLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open listings"}
				{...uiMenuButton({
					className: [],
				})}
				icon={CartIcon}
				to="/$locale/app/buyer/feed/default"
				params={{
					locale,
				}}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
