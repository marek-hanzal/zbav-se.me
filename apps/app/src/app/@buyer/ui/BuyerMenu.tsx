import { UserIcon } from "@use-pico/client/icon";
import { asButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
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

export const BuyerMenu = ({ locale, ...props }: BuyerMenu.Props) => {
	const spacing = tvc([
		"w-full",
		"flex",
		"flex-col",
		"gap-2",
		"py-4",
	]);
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"BuyerMenu-root"}
			position={"relative"}
			height={"full"}
			width={"full"}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				data-ui={"BuyerMenu-container"}
				ref={containerRef}
				scroll={"vertical"}
				height={"full"}
			>
				<Container
					data-ui={"BuyerMenu-content"}
					layout={"vertical-flex"}
					gap={"sm"}
				>
					<LinkTo
						{...asButton({
							tone: "primary",
							theme: "light",
							justify: "start",
							round: "default",
							size: "xl",
							background: true,
						})}
						icon={ListingIcon}
						iconProps={{
							size: "2xl",
						}}
						to="/$locale/buyer/feed/default"
						params={{
							locale,
						}}
					>
						<Tx label="Listings (label)" />
					</LinkTo>

					<div className={spacing}>
						<LinkTo
							{...asButton({
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
								background: true,
							})}
							icon={CartIcon}
							iconProps={{
								size: "2xl",
							}}
							to="/$locale/buyer/cart/list"
							params={{
								locale,
							}}
						>
							<Tx label="Cart (label)" />
						</LinkTo>

						<LinkTo
							{...asButton({
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
								background: true,
							})}
							icon={TransactionIcon}
							iconProps={{
								size: "2xl",
							}}
							to="/$locale/buyer/transaction/list"
							params={{
								locale,
							}}
						>
							<Tx label="Transactions (label)" />
						</LinkTo>

						<LinkTo
							{...asButton({
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
								background: true,
							})}
							icon={FeedIcon}
							iconProps={{
								size: "2xl",
							}}
							to="/$locale/buyer/feed/select"
							params={{
								locale,
							}}
						>
							<Tx label="Feed (label)" />
						</LinkTo>
					</div>

					<LinkTo
						{...asButton({
							tone: "secondary",
							theme: "light",
							justify: "start",
							round: "default",
							size: "xl",
							background: true,
						})}
						icon={ShopIcon}
						iconProps={{
							size: "2xl",
						}}
						to="/$locale/buyer/shop"
						params={{
							locale,
						}}
					>
						<Tx label="Shop (label)" />
					</LinkTo>

					<div className={spacing}>
						<LinkTo
							{...asButton({
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
								background: true,
							})}
							icon={SellerIcon}
							iconProps={{
								size: "2xl",
							}}
							to="/$locale/seller"
							params={{
								locale,
							}}
						>
							<Tx label="To seller (label)" />
						</LinkTo>

						<LinkTo
							{...asButton({
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
								background: true,
							})}
							icon={UserIcon}
							iconProps={{
								size: "2xl",
							}}
							to="/$locale/buyer/user"
							params={{
								locale,
							}}
						>
							<Tx label="User profile (label)" />
						</LinkTo>
					</div>

					<SignOutButton locale={locale} />
				</Container>
			</Container>
		</Container>
	);
};
