import { useMatchRoute } from "@tanstack/react-router";
import { DraftIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";
import { useLocale } from "~/locale/hook/useLocale";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { withFallback } from "~/ui/fn/withFallback";
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
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const DraftLink = withFallback(
	({ _suspense, ...props }: DraftLink.Props) => {
		const locale = useLocale();
		const matchRoute = useMatchRoute();
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
				{...uiMenuButton({})}
				icon={
					data.length > 0
						? "icon-[solar--bill-check-linear]"
						: "icon-[solar--bill-list-linear]"
				}
				to="/$locale/app/seller/draft/resolve"
				params={{
					locale,
				}}
				{...(matchRoute({
					to: "/$locale/app/seller/draft/$id/edit",
				})
					? uiMenuButton({
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
				{...uiMenuButton({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/resolve"
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
