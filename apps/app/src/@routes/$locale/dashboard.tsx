import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BuyerIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { Tile } from "~/app/ui/dashboard/Tile";

export const Route = createFileRoute("/$locale/dashboard")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				ui="Dashboard-root"
				layout={"vertical"}
				gap={"lg"}
				height={"fit"}
				items={"center"}
				square={"xl"}
			>
				<Container
					ui="Dashboard-container"
					layout={"vertical-flex"}
					height={"content"}
					gap={"xl"}
				>
					<Logo />

					<LinkTo
						to="/$locale/change-side/$side"
						params={{
							locale,
							side: "seller",
						}}
						full
					>
						<Tile
							iconEnabled={SellerIcon}
							label={"I want to sell (label)"}
							size={"xl"}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/change-side/$side"
						params={{
							locale,
							side: "buyer",
						}}
						full
					>
						<Tile
							iconEnabled={BuyerIcon}
							label={"I want to buy (label)"}
							size={"xl"}
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
			</Container>
		);
	},
});
