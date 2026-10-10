import { FavouriteIcon } from "~/application-ui/constant/icon.exports";
import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace FavouritesLink {
	export interface Props
		extends uiLinkToFn.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const FavouritesLink = withFallbackFn(
	({ _suspense, ...props }: FavouritesLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open favourites"}
				{...uiMenuButtonFn({})}
				icon={FavouriteIcon}
				to="/$locale/app/buyer/favourite/list"
				params={{
					locale,
				}}
				activeProps={uiMenuButtonFn({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButtonFn({
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
				{...uiMenuButtonFn({})}
				icon={FavouriteIcon}
				to="/$locale/app/buyer/favourite/list"
				params={{
					locale,
				}}
				activeProps={uiMenuButtonFn({
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
