import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { tvc } from "@use-pico/cls";
import { BuyerIcon, PostIcon, PublicIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { Tile } from "@zbav-se.me/ui/tile";
import { useRef } from "react";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const SellerMenu = ({ locale, ...props }: SellerMenu.Props) => {
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
			ui={"SellerMenu-root"}
			position={"relative"}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				ui="Seller-container"
				layout={"vertical-flex"}
				scroll={"vertical"}
				gap={"sm"}
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
						tone={"secondary"}
					/>
				</LinkTo>

				<div className={spacing}>
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
				</div>

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

				<div className={spacing}>
					<LinkTo
						to="/$locale/buyer"
						params={{
							locale,
						}}
						full
					>
						<Tile
							iconEnabled={BuyerIcon}
							label={"To buyer (label)"}
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
