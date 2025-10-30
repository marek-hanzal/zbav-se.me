import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Container,
	LinkTo,
	SpinnerIcon,
	UserIcon,
} from "@use-pico/client";
import { PostIcon, PrimaryOverlay, PublicIcon, ShopIcon } from "@zbav-se.me/ui";
import { Tile } from "~/app/ui/dashboard/Tile";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/seller/")({
	component() {
		const { locale } = Route.useParams();
		const navigate = useNavigate();
		const router = useRouter();
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

				<Container
					layout={"vertical-flex"}
					scroll={"vertical"}
					gap={"sm"}
					items={"center"}
					tone={"secondary"}
					theme={"light"}
					square={"md"}
					position={"relative"}
				>
					<LinkTo
						to="/$locale/seller/listing/wizard/photos"
						params={{
							locale,
						}}
						full
					>
						<Tile
							icon={PostIcon}
							textTitle={"Create listing (label)"}
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
							icon={PublicIcon}
							textTitle={"My listings (label)"}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/shop"
						params={{
							locale,
						}}
						full
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
						full
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
				</Container>
			</Container>
		);
	},
});
