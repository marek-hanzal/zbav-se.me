import { createFileRoute } from "@tanstack/react-router";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { BuyerIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { Tile } from "@zbav-se.me/ui/tile";
import { match } from "ts-pattern";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export const Route = createFileRoute("/$locale/dashboard")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const userExPatchMutation = withUserExPatchMutation.useMutation({
			async onPostMutation({ result }) {
				return match(result.side)
					.with("buyer", () => {
						return navigate({
							to: "/$locale/buyer",
						});
					})
					.with("seller", () => {
						return navigate({
							to: "/$locale/seller",
						});
					})
					.with(undefined, null, () => {
						// noop
					})
					.exhaustive();
			},
		});

		return (
			<Container
				ui="Dashboard-root"
				layout={"vertical-header-content-footer"}
				height={"fit"}
				items={"center"}
				square={"md"}
			>
				<Logo />

				<Container
					ui="Dashboard-container"
					layout={"vertical-flex"}
					height={"content"}
					gap={"xl"}
				>
					{userExPatchMutation.isPending ? null : (
						<>
							<Tile
								iconEnabled={SellerIcon}
								label={"I want to sell (label)"}
								size={"xl"}
								disabled={userExPatchMutation.isPending}
								onClick={() => {
									userExPatchMutation.mutate({
										side: "seller",
									});
								}}
							/>

							<Tile
								iconEnabled={BuyerIcon}
								label={"I want to buy (label)"}
								size={"xl"}
								disabled={userExPatchMutation.isPending}
								onClick={() => {
									userExPatchMutation.mutate({
										side: "buyer",
									});
								}}
							/>
						</>
					)}

					{userExPatchMutation.isPending ? <SpinnerContainer /> : null}
				</Container>

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
		);
	},
});
