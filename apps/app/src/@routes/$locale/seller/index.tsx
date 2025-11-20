import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { PostIcon, PublicIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { Tile } from "~/app/ui/dashboard/Tile";

export const Route = createFileRoute("/$locale/seller/")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="Seller-root"
				textTitle={"Seller home (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to="/$locale/change-side/$side"
						params={{
							locale,
							side: "none",
						}}
					/>
				}
			>
				<Container
					ui="Seller-container"
					layout={"vertical-flex"}
					scroll={"vertical"}
					gap={"sm"}
					items={"center"}
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

				<SignOutButton
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
			</TitleContainer>
		);
	},
});
