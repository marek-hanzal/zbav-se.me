import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Container,
	LinkTo,
	type LinkToCls,
	SpinnerIcon,
	UserIcon,
} from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { PostIcon, PrimaryOverlay, PublicIcon, ShopIcon } from "@zbav-se.me/ui";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Tile } from "~/app/ui/dashboard/Tile";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/seller/")({
	component() {
		const { locale } = Route.useParams();
		const navigate = useNavigate();
		const router = useRouter();
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
		const userExPatchMutation = withUserExPatchMutation.useMutation({
			async onPostMutation() {
				await router.invalidate();
				return navigate({
					to: "/$locale/dashboard",
					params: {
						locale,
					},
				});
			},
		});

		return (
			<Container position={"relative"}>
				<PrimaryOverlay />

				<FlowContainer overflow={"vertical"}>
					<div
						data-ui="Seller-link"
						className="grid gap-2 place-items-center"
					>
						<LinkTo
							to="/$locale/listing/wizard/start"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={PostIcon}
								textTitle={"Create listing (label)"}
							/>
						</LinkTo>

						<LinkTo
							to="/$locale/listing/my"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={PublicIcon}
								textTitle={"My listings (label)"}
							/>
						</LinkTo>

						<LinkTo
							to="/$locale/shop"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={ShopIcon}
								textTitle={"Shop (label)"}
							/>
						</LinkTo>

						<LinkTo
							to="/$locale/user"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={UserIcon}
								textTitle={"User profile (label)"}
							/>
						</LinkTo>

						<Tile
							icon={
								userExPatchMutation.isPending
									? SpinnerIcon
									: ArrowLeftIcon
							}
							iconProps={{
								size: "md",
							}}
							textTitle={"Back to dashboard (label)"}
							statusProps={{
								titleProps: {
									size: "md",
								},
							}}
							divProps={{
								onClick() {
									userExPatchMutation.mutate({
										side: null,
									});
								},
							}}
							tweak={{
								slot: {
									root: {
										class: [
											"px-12",
										],
									},
								},
							}}
						/>
					</div>
				</FlowContainer>
			</Container>
		);
	},
});
