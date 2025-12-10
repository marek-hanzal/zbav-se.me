import { UserIcon, type uiIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import {
	CartIcon,
	FeedIcon,
	ListingIcon,
	SellerIcon,
	ShopIcon,
	TransactionIcon,
} from "@zbav-se.me/ui/icon";
import { useRef } from "react";

export namespace BuyerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const BuyerMenu = ({ locale, ui, ...props }: BuyerMenu.Props) => {
	const spacing: uiContainer.Ui = {
		layout: "vertical-flex",
		width: "full",
		gap: "default",
	};
	const icon: uiIcon.Ui = {
		text: "2xl",
	};
	const button: uiButton.Ui = {
		tone: "brand",
		theme: "light",
		inner: "sm",
		width: "full",
		text: "lg",
		gap: "sm",
	};

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"BuyerMenu"}
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
				data-ui={"BuyerMenu-container"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "xl",
				}}
			>
				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
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

				<Container ui={spacing}>
					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={TransactionIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer/transaction/list"
						params={{
							locale,
						}}
					>
						<Tx label="Transactions (label)" />
					</LinkTo>

					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
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
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={CartIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer/cart/list"
						params={{
							locale,
						}}
					>
						<Tx label="Cart (label)" />
					</LinkTo>
				</Container>

				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
						className: [],
					})}
					icon={ShopIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/buyer/shop"
					params={{
						locale,
					}}
				>
					<Tx label="Shop (label)" />
				</LinkTo>

				<Container ui={spacing}>
					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={SellerIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/seller"
						params={{
							locale,
						}}
					>
						<Tx label="To seller (label)" />
					</LinkTo>

					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={UserIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer/user"
						params={{
							locale,
						}}
					>
						<Tx label="User profile (label)" />
					</LinkTo>
				</Container>
			</Container>
		</Container>
	);
};
