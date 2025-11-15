import { createFileRoute, redirect } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BuyerIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { match } from "ts-pattern";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { Tile } from "~/app/ui/dashboard/Tile";

export const Route = createFileRoute("/$locale/dashboard")({
	async beforeLoad({ params: { locale }, context: { user } }) {
		if (user.side) {
			match(user.side)
				.with("seller", () => {
					throw redirect({
						to: "/$locale/seller",
						params: {
							locale,
						},
						statusCode: 302,
					});
				})
				.with("buyer", () => {
					throw redirect({
						to: "/$locale/buyer",
						params: {
							locale,
						},
						statusCode: 302,
					});
				})
				.exhaustive();
		}
	},
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				layout={"vertical"}
				gap={"lg"}
				height={"fit"}
				items={"center"}
				tone={"secondary"}
				theme={"light"}
				square={"xl"}
			>
				<Container
					layout={"vertical-flex"}
					gap={"xl"}
					height={"content"}
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
