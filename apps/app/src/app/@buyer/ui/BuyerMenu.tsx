import { UserIcon } from "@use-pico/client/icon";
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
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export namespace BuyerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const BuyerMenu = ({ locale, ui, ...props }: BuyerMenu.Props) => {
	const spacing: uiContainer.Ui = {
		layout: "vertical-flex",
		width: "full",
		gap: "md",
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
					gap: "lg",
				}}
			>
				<LinkTo
					{...uiButton({
						ui: {
							justify: "start",
							size: "xl",
							width: "full",
						},
						className: [],
					})}
					icon={ListingIcon}
					iconProps={{
						ui: {
							size: "2xl",
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
								tone: "secondary",
								justify: "start",
								size: "xl",
								width: "full",
							},
							className: [],
						})}
						icon={CartIcon}
						iconProps={{
							ui: {
								size: "2xl",
							},
						}}
						to="/$locale/buyer/cart/list"
						params={{
							locale,
						}}
					>
						<Tx label="Cart (label)" />
					</LinkTo>

					<LinkTo
						{...uiButton({
							ui: {
								tone: "secondary",
								justify: "start",
								size: "xl",
								width: "full",
							},
							className: [],
						})}
						icon={TransactionIcon}
						iconProps={{
							ui: {
								size: "2xl",
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
								tone: "secondary",
								justify: "start",
								size: "xl",
								width: "full",
							},
							className: [],
						})}
						icon={FeedIcon}
						iconProps={{
							ui: {
								size: "2xl",
							},
						}}
						to="/$locale/buyer/feed/select"
						params={{
							locale,
						}}
					>
						<Tx label="Feed (label)" />
					</LinkTo>
				</Container>

				<LinkTo
					{...uiButton({
						ui: {
							tone: "secondary",
							justify: "start",
							size: "xl",
							width: "full",
						},
						className: [],
					})}
					icon={ShopIcon}
					iconProps={{
						ui: {
							size: "2xl",
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
								tone: "secondary",
								justify: "start",
								size: "xl",
								width: "full",
							},
							className: [],
						})}
						icon={SellerIcon}
						iconProps={{
							ui: {
								size: "2xl",
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
								tone: "secondary",
								justify: "start",
								size: "xl",
								width: "full",
							},
							className: [],
						})}
						icon={UserIcon}
						iconProps={{
							ui: {
								size: "2xl",
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

				<SignOutButton locale={locale} />
			</Container>
		</Container>
	);
};
