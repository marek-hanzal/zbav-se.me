import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { CartIcon, FeedIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { Tile } from "~/app/ui/dashboard/Tile";

export const Route = createFileRoute("/$locale/buyer/")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Buyer home (title)"}
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
					layout={"vertical-flex"}
					scroll={"vertical"}
					gap={"sm"}
					items={"center"}
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

					<SignOutButton
						tweak={{
							slot: {
								wrapper: {
									class: [
										"py-12",
										"mx-auto",
									],
								},
							},
						}}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
