import { createFileRoute } from "@tanstack/react-router";
import {
	Container,
	LinkTo,
	type LinkToCls,
	Tx,
	UserIcon,
} from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { Tile } from "~/app/ui/dashboard/Tile";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
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
			<Container
				layout={"vertical-full"}
				gap={"md"}
				tone="primary"
				theme="light"
				square={"md"}
			>
				<PrimaryOverlay opacity={"50"} />

				<div className="grid grid-cols-2 gap-2 h-full w-full">
					<LinkTo
						to="/$locale/app/listing/create"
						params={{
							locale,
						}}
						tweak={linkTweak}
					>
						<Tile
							icon={PostIcon}
							textTitle={<Tx label={"Create listing (label)"} />}
							textMessage={
								<Tx label={"Create listing (description)"} />
							}
						/>
					</LinkTo>

					<LinkTo
						to="/$locale/app/feed"
						params={{
							locale,
						}}
						tweak={linkTweak}
					>
						<Tile
							icon={FeedIcon}
							textTitle={<Tx label={"Feed (label)"} />}
							textMessage={<Tx label={"Feed (description)"} />}
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
							textTitle={<Tx label={"Bag (label)"} />}
							textMessage={<Tx label={"Bag (description)"} />}
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
							textTitle={<Tx label={"User profile (label)"} />}
							textMessage={
								<Tx label={"User profile (description)"} />
							}
						/>
					</LinkTo>
				</div>
			</Container>
		);
	},
});
