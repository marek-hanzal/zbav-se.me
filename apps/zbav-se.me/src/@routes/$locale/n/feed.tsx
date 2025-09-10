import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { Content } from "~/app/ui/content/Content";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/feed")({
	component() {
		return (
			<>
				<Title icon={FeedIcon}>
					<Tx
						label={"Feed (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Content>content</Content>

				<Nav active="feed" />
			</>
		);
	},
});
