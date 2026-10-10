import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { CartIcon } from "~/ui/constant/CartIcon";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace ListingsLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const ListingsLink = withFallback(
	({ _suspense, ...props }: ListingsLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open listings"}
				{...uiMenuButton({})}
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
				{...uiMenuButton({})}
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
