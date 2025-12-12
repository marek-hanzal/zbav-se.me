import type { uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { FavouriteIcon, FeedIcon, ListingIcon, MessageIcon, ShopIcon } from "@zbav-se.me/ui/icon";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";

export namespace BuyerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const BuyerMenu = ({ locale, ui, ...props }: BuyerMenu.Props) => {
	const icon: uiIcon.Ui = {
		text: "3xl",
	};

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"BuyerMenu[Container]"}
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
				data-ui={"BuyerMenu-[Container.scroll]"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "lg",
					items: "center",
					gap: "lg",
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
					<Tx label="Listings (label)" />
				</LinkTo>

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
					to="/$locale/ui/buyer/message/list"
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
					icon={FeedIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/buyer/feed/select"
					params={{
						locale,
					}}
				>
					<Tx label="Feed (label)" />
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
					<Tx label="Favourites (label)" />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ShopIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/shop"
					params={{
						locale,
					}}
				>
					<Tx label="Shop (label)" />
				</LinkTo>
			</Container>
		</Container>
	);
};
