import { UserIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
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

export const BuyerMenu = ({ locale, ui, ...props }: BuyerMenu.Props) => {
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
					scroll: "vertical",
					height: "full",
				}}
			>
				<Container
					data-ui={"BuyerMenu-content"}
					ui={{
						layout: "vertical-flex",
						gap: "sm",
						inner: "default",
						items: "center",
					}}
				>
					<LinkTo
						{...uiButton({
							ui: {
								justify: "start",
								size: "xl",
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

					<div className={spacing}>
						<LinkTo
							{...uiButton({
								ui: {
									tone: "secondary",
									justify: "start",
									size: "xl",
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
					</div>

					<LinkTo
						{...uiButton({
							ui: {
								tone: "secondary",
								justify: "start",
								size: "xl",
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

					<div className={spacing}>
						<LinkTo
							{...uiButton({
								ui: {
									tone: "secondary",
									justify: "start",
									size: "xl",
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
					</div>

					<SignOutButton locale={locale} />
				</Container>
			</Container>
		</Container>
	);
};
