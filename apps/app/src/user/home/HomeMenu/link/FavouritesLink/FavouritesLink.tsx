import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { useLocale } from "@/lib/client/locale";
import { FavouriteIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace FavouritesLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const FavouritesLink = withFallback(
	({ _suspense, ...props }: FavouritesLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open favourites"}
				{...uiMenuButton({
					className: [],
				})}
				icon={FavouriteIcon}
				to="/$locale/app/buyer/favourite/list"
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
					<Tx label="Favourites (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<FavouritesLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open favourites"}
				{...uiMenuButton({
					className: [],
				})}
				icon={FavouriteIcon}
				to="/$locale/app/buyer/favourite/list"
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
