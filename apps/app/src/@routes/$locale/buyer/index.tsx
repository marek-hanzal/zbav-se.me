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
import {
	BagIcon,
	FeedIcon,
	FlowContainer,
	PrimaryOverlay,
	ShopIcon,
} from "@zbav-se.me/ui";
import { Tile } from "~/app/ui/dashboard/Tile";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/buyer/")({
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

				<FlowContainer scroll={"vertical"}>
					<div
						data-ui="Buyer-link"
						className="grid gap-2 place-items-center"
					>
						<LinkTo
							to="/$locale/buyer/feed/select"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={FeedIcon}
								textTitle={"Feed (label)"}
							/>
						</LinkTo>

						<LinkTo
							to="/$locale/buyer/bag"
							params={{
								locale,
							}}
							tweak={linkTweak}
						>
							<Tile
								icon={BagIcon}
								textTitle={"Bag (label)"}
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
