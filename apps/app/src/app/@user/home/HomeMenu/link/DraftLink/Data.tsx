import { useMatchRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ...props }) => {
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
};
