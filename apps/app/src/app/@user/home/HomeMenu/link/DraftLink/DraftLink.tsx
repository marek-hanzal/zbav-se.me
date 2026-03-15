import { useMatchRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { DraftIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";

/**
 * Renders a dedicated home menu draft navigation link with domain-specific state handling.
 * Use it when the home menu draft destination should be shown conditionally in navigation.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export namespace DraftLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const DraftLink = withFallback(({ _suspense, ...props }: DraftLink.Props) => {
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
			{...uiMenuButton({
				className: [],
			})}
			icon={
				data.length > 0
					? "icon-[solar--bill-check-linear]"
					: "icon-[solar--bill-list-linear]"
			}
			to="/$locale/seller/draft/resolve"
			params={{
				locale,
			}}
			{...(matchRoute({
				to: "/$locale/seller/draft/$id/edit",
			})
				? uiMenuButton({
						ui: {
							tone: "primary",
							theme: "light",
						},
						className: [],
					})
				: {})}
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
				<Tx
					label={data.length > 0 ? "Continue listing (label)" : "Create listing (label)"}
				/>
			</TypoIcon>
		</LinkTo>
	);
}, (props: Omit<DraftLink.Props, "_suspense">) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"create listing"}
			{...uiMenuButton({
				className: [],
			})}
			icon={DraftIcon}
			to="/$locale/seller/draft/resolve"
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
