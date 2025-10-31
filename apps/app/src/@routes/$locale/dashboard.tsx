import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Container, LinkTo, type LinkToCls } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { BuyerIcon, SellerIcon } from "@zbav-se.me/ui";
import { match } from "ts-pattern";
import { Tile } from "~/app/ui/dashboard/Tile";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/dashboard")({
	ssr: false,
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
		const router = useRouter();
		const linkTweak: Cls.TweaksOf<LinkToCls> = {
			slot: {
				root: {
					class: [
						"block",
						"h-[100%]",
						"w-full",
					],
				},
			},
		};
		const userExPatchMutation = withUserExPatchMutation.useMutation({
			async onPostMutation() {
				return router.invalidate();
			},
		});

		return (
			<Container
				layout={"vertical"}
				scroll={"vertical"}
				gap={"lg"}
				height={"fit"}
				items={"center"}
				tone={"secondary"}
				theme={"light"}
				square={"xl"}
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
						textMessage={"I want to sell (message)"}
						height={"fit"}
						layout={"vertical-centered"}
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
						textMessage={"I want to buy (message)"}
						height={"fit"}
						layout={"vertical-centered"}
					/>
				</LinkTo>
			</Container>
		);
	},
});
