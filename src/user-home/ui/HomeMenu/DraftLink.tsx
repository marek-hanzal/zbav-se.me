import { useMatchRoute } from "@tanstack/react-router";
import { DraftIcon } from "~/application-ui/constant/icon.exports";
import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

/**
 * Renders a dedicated home menu draft navigation link with domain-specific state handling.
 * Use it when the home menu draft destination should be shown conditionally in navigation.
 *
 * @see src/@routes/$locale/app/home.tsx
 */
export namespace DraftLink {
	export interface Props
		extends uiLinkToFn.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const DraftLink = withFallbackFn(
	({ _suspense, ...props }: DraftLink.Props) => {
		const locale = useLocale();
		const matchRouteFn = useMatchRoute();
		const { data } = withDraftQuery.useCollectionQuery({
			cursor: {
				page: 0,
				size: 1,
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		});

		return (
			<LinkTo
				data-action={data.length > 0 ? "continue listing" : "create listing"}
				preload={false}
				{...uiMenuButtonFn({})}
				icon={
					data.length > 0
						? "icon-[solar--bill-check-linear]"
						: "icon-[solar--bill-list-linear]"
				}
				to="/$locale/app/seller/draft/resolve"
				params={{
					locale,
				}}
				{...(matchRouteFn({
					to: "/$locale/app/seller/draft/$id/edit",
				})
					? uiMenuButtonFn({
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})
					: {})}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Tx
						label={
							data.length > 0 ? "Continue listing (label)" : "Create listing (label)"
						}
					/>
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<DraftLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"create listing"}
				preload={false}
				{...uiMenuButtonFn({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/resolve"
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
