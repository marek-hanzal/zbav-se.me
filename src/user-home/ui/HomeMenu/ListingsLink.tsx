import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { CartIcon } from "~/ui/constant/CartIcon";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace ListingsLink {
	export interface Props
		extends uiLinkToFn.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const ListingsLink = withFallbackFn(
	({ _suspense, ...props }: ListingsLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open listings"}
				{...uiMenuButtonFn({})}
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
						"data-ui-opacity": "5",
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
				{...uiMenuButtonFn({})}
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
