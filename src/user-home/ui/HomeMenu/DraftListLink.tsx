import { DraftIcon } from "~/application-ui/constant/icon.exports";
import { uiMenuButton } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace DraftListLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const DraftListLink = withFallback(
	({ _suspense, ...props }: DraftListLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open draft list"}
				{...uiMenuButton({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
				{...uiMenuButton({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
