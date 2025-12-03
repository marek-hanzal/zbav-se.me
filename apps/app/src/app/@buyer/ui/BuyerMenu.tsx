import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { tvc } from "@use-pico/cls";
import {
	CartIcon,
	FeedIcon,
	ListingIcon,
	SellerIcon,
	ShopIcon,
	TransactionIcon,
} from "@zbav-se.me/ui/icon";
import { Tile } from "@zbav-se.me/ui/tile";
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
		<Container position={"relative"}>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				layout={"vertical-flex"}
				scroll={"vertical"}
				gap={"sm"}
				items={"center"}
				{...props}
			>
				<LinkTo
					to="/$locale/buyer/listing/feed"
					params={{
						locale,
					}}
					full
				>
					<Tile
						iconEnabled={ListingIcon}
						label={"Listings (label)"}
						tone={"secondary"}
					/>
				</LinkTo>

				<div className={spacing}>
					<LinkTo
						to="/$locale/buyer/cart/list"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={CartIcon}
							label={"Cart (label)"}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/buyer/transaction/list"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={TransactionIcon}
							label={"Transactions (label)"}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/buyer/feed/select"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={FeedIcon}
							label={"Feed (label)"}
						/>
					</LinkTo>
				</div>

				<LinkTo
					to="/$locale/buyer/shop"
					params={{
						locale,
					}}
					full
				>
					<Tile
						iconEnabled={ShopIcon}
						label={"Shop (label)"}
					/>
				</LinkTo>

				<div className={spacing}>
					<LinkTo
						to="/$locale/seller"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={SellerIcon}
							label={"To seller (label)"}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/buyer/user"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={UserIcon}
							label={"User profile (label)"}
						/>
					</LinkTo>
				</div>

				<SignOutButton
					locale={locale}
					tweak={{
						slot: {
							wrapper: {
								class: [
									"mx-auto",
								],
							},
						},
					}}
				/>
			</Container>
		</Container>
	);
};
