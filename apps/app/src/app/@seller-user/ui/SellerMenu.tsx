import { useLocale } from "@use-pico/client/hook";
import { ListIcon, type uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withDraftCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { DraftIcon, ListingIcon, MessageIcon } from "@zbav-se.me/ui/icon";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";

export namespace SellerMenu {
	export interface Props extends Container.Props {}
}

export const SellerMenu = ({ ui, ...props }: SellerMenu.Props) => {
	const locale = useLocale();
	const icon: uiIcon.Ui = {
		text: "3xl",
	};

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"SellerMenu"}
			ui={{
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				data-ui={"SellerMenu-container"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "lg",
				}}
			>
				<withDraftCollectionQuery.Suspense
					data={{
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
								direction: "desc",
							},
						],
					}}
					fallback={
						<LinkTo
							{...uiMenuButton({
								className: [],
							})}
							icon={ListingIcon}
							iconProps={{
								ui: {
									...icon,
								},
							}}
							to="/$locale/ui/seller/draft/resolve"
							params={{
								locale,
							}}
						>
							<Tx label={"Loading... (label)"} />
						</LinkTo>
					}
				>
					{({ data }) => {
						return (
							<LinkTo
								{...uiMenuButton({
									className: [],
								})}
								icon={ListingIcon}
								iconProps={{
									ui: {
										...icon,
									},
								}}
								to="/$locale/ui/seller/draft/resolve"
								params={{
									locale,
								}}
							>
								<Tx
									label={
										data.data.length > 0
											? "Continue listing (label)"
											: "Create listing (label)"
									}
								/>
							</LinkTo>
						);
					}}
				</withDraftCollectionQuery.Suspense>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={MessageIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/message/list"
					params={{
						locale,
					}}
				>
					<Tx label="Messages (label)" />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={DraftIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/draft/list"
					params={{
						locale,
					}}
				>
					<Tx label={"Draft list (label)"} />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ListIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/listing/my"
					params={{
						locale,
					}}
				>
					<Tx label="My listings (label)" />
				</LinkTo>
			</Container>
		</Container>
	);
};
