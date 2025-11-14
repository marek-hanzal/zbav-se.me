import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo, type LinkToCls } from "@use-pico/client/ui/link-to";
import type { Cls } from "@use-pico/cls";
import { linkTo } from "@use-pico/common/link-to";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/session";
import { BuyerIcon, LockIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { match } from "ts-pattern";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";
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
		const router = useRouter();
		const navigate = useNavigate();
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
		const signOutMutation = withSignOutMutation.useMutation({
			async onPostMutation() {
				return navigate({
					href: linkTo({
						base: import.meta.env.VITE_WEB_ORIGIN,
						href: "/:locale/landing",
						query: {
							locale,
						},
					}),
				});
			},
		});

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
							iconEnabled={SellerIcon}
							label={"I want to sell (label)"}
							size={"xl"}
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
							iconEnabled={BuyerIcon}
							label={"I want to buy (label)"}
							size={"xl"}
						/>
					</LinkTo>

					<Button
						iconEnabled={LockIcon}
						onClick={() => signOutMutation.mutate({})}
						disabled={signOutMutation.isPending}
						loading={signOutMutation.isPending}
						tone={"secondary"}
						theme={"light"}
						label={"Sign out"}
						size={"lg"}
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
