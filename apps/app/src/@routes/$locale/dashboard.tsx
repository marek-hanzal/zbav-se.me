import { createFileRoute } from "@tanstack/react-router";
import { Container, LinkTo, type LinkToCls } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { BuyerIcon, PrimaryOverlay, SellerIcon } from "@zbav-se.me/ui";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Tile } from "~/app/ui/dashboard/Tile";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/dashboard")({
	component() {
		const { locale } = Route.useParams();
		const linkTweak: Cls.TweaksOf<LinkToCls> = {
			slot: {
				root: {
					class: [
						"block",
						"h-full",
						"w-full",
					],
				},
			},
		};
		const userExPatchMutation = withUserExPatchMutation.useMutation();

		return (
			<Container position={"relative"}>
				<PrimaryOverlay />

				<FlowContainer
					layout={"vertical-content"}
					overflow={"vertical"}
					height={"full"}
					tweak={{
						slot: {
							root: {
								class: [
									"grid-rows-1",
									// "place-content-center",
									"place-items-center",
								],
							},
						},
					}}
				>
					<div
						data-ui="Dashboard-link"
						className="grid gap-2 w-full"
					>
						<LinkTo
							to="/$locale/seller"
							params={{
								locale,
							}}
							tweak={linkTweak}
							onClick={() =>
								userExPatchMutation.mutate({
									side: "seller",
								})
							}
						>
							<Tile
								icon={SellerIcon}
								textTitle={"I want to sell (label)"}
							/>
						</LinkTo>

						<LinkTo
							to="/$locale/buyer"
							params={{
								locale,
							}}
							tweak={linkTweak}
							onClick={() =>
								userExPatchMutation.mutate({
									side: "buyer",
								})
							}
						>
							<Tile
								icon={BuyerIcon}
								textTitle={"I want to buy (label)"}
							/>
						</LinkTo>
					</div>
				</FlowContainer>
			</Container>
		);
	},
});
