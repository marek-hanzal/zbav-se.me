import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, ListIcon, type uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withDraftCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { DraftIcon, FavouriteIcon, FeedIcon, ListingIcon, MessageIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";

export namespace HomeMenu {
	export interface Props extends Container.Props {
		//
	}
}

export const HomeMenu = ({ ui, ...props }: HomeMenu.Props) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const icon: uiIcon.Ui = {
		color: "icon",
		text: "2xl",
	};

	return (
		<Container
			data-ui="HomeMenu[Container]"
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
				data-ui={"HomeMenu-Content[Container]"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "md",
				}}
			>
				<Group
					ui={{
						tone: "neutral",
						theme: "light",
						width: "full",
					}}
				>
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
						to="/$locale/buyer/feed/default"
						params={{
							locale,
						}}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label="Listings (label)" />
						</TypoIcon>
					</LinkTo>

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
									order: "desc",
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
									<TypoIcon
										flip
										icon={ChevronRightIcon}
										iconProps={{
											ui: {
												opacity: "xl",
											},
										}}
									>
										<Tx
											label={
												data.data.length > 0
													? "Continue listing (label)"
													: "Create listing (label)"
											}
										/>
									</TypoIcon>
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
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label="Messages (label)" />
						</TypoIcon>
					</LinkTo>
				</Group>

				<Group
					ui={{
						width: "full",
					}}
				>
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
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label="My listings (label)" />
						</TypoIcon>
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
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label={"Draft list (label)"} />
						</TypoIcon>
					</LinkTo>

					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={FeedIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/ui/buyer/feed/select"
						params={{
							locale,
						}}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label="Feed (label)" />
						</TypoIcon>
					</LinkTo>

					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={FavouriteIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/ui/buyer/favourite/list"
						params={{
							locale,
						}}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
								},
							}}
						>
							<Tx label="Favourites (label)" />
						</TypoIcon>
					</LinkTo>
				</Group>
			</Container>
		</Container>
	);
};
