import { useParams } from "@tanstack/react-router";
import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PostIcon, PublicIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { Tile } from "@zbav-se.me/ui/tile";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		//
	}
}

export const SellerMenu = ({ ...props }: SellerMenu.Props) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Container
			ui="Seller-container"
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"sm"}
			items={"center"}
			{...props}
		>
			<LinkTo
				to="/$locale/seller/listing/wizard/photos"
				params={{
					locale,
				}}
				full
			>
				<Tile
					iconEnabled={PostIcon}
					label={"Create listing (label)"}
				/>
			</LinkTo>

			<LinkTo
				to="/$locale/seller/listing/my"
				params={{
					locale,
				}}
				full
			>
				<Tile
					iconEnabled={PublicIcon}
					label={"My listings (label)"}
				/>
			</LinkTo>

			<LinkTo
				to="/$locale/seller/transaction/list"
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
				to="/$locale/seller/shop"
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
				to="/$locale/seller/user"
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
