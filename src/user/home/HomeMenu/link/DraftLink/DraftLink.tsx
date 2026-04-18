import { useMatchRoute } from "@tanstack/react-router";
import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { DraftIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";

/**
 * Renders a dedicated home menu draft navigation link with domain-specific state handling.
 * Use it when the home menu draft destination should be shown conditionally in navigation.
 *
 * @see src/@user/home/page/HomePage.tsx
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
			where: {
				usedAtIsNull: true,
			},
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
