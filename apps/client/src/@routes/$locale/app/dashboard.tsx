import { createFileRoute } from "@tanstack/react-router";
import { Container, LinkTo, type LinkToCls, UserIcon } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Tile } from "~/app/ui/dashboard/Tile";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { PublicIcon } from "~/app/ui/icon/PublicIcon";
import { ShopIcon } from "~/app/ui/icon/ShopIcon";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export const Route = createFileRoute("/$locale/app/dashboard")({
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

		return (
			<Container position={"relative"}>
				<PrimaryOverlay />

				<FlowContainer overflow={"vertical"}>
					<div className="grid grid-cols-2 grid-rows-3 gap-2 h-full w-full">
						<LinkTo
							to="/$locale/app/feed"
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
							to="/$locale/app/listing/create"
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
							to="/$locale/app/listing/my"
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
							to="/$locale/app/bag"
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
							to="/$locale/app/shop"
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
							to="/$locale/app/user"
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
					</div>

					<div />
				</FlowContainer>
			</Container>
		);
	},
});
