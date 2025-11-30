import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { CartIcon, FeedIcon, SellerIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { Tile } from "@zbav-se.me/ui/tile";

export namespace BuyerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const BuyerMenu = ({ locale, ...props }: BuyerMenu.Props) => {
	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"sm"}
			items={"center"}
			{...props}
		>
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
					tone={"secondary"}
				/>
			</LinkTo>

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
		</Container>
	);
};
