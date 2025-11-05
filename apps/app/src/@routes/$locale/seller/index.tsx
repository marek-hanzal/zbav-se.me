import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Icon,
	SpinnerIcon,
	UserIcon,
} from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { PostIcon, PublicIcon, ShopIcon } from "@zbav-se.me/ui/icon";
import { Tile } from "~/app/ui/dashboard/Tile";

export const Route = createFileRoute("/$locale/seller/")({
	component() {
		const { locale } = Route.useParams();
		const router = useRouter();
		const userExPatchMutation = withUserExPatchMutation.useMutation({
			async onPostMutation() {
				router.invalidate();
				await router.navigate({
					to: "/$locale/dashboard",
					params: {
						locale,
					},
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Seller home (title)"}
				left={
					<Icon
						icon={
							userExPatchMutation.isPending
								? SpinnerIcon
								: ArrowLeftIcon
						}
						tone={"secondary"}
						size={"sm"}
						onClick={() => {
							userExPatchMutation.mutate({
								side: null,
							});
						}}
					/>
				}
			>
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
				</Container>
			</TitleContainer>
		);
	},
});
