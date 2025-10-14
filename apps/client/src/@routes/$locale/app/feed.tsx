import { createFileRoute } from "@tanstack/react-router";
import { Container, Tx } from "@use-pico/client";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/app/feed")({
	component() {
		return (
			<Container layout={"vertical-header-content-footer"}>
				<Title icon={FeedIcon}>
					<Tx
						label={"Feed (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Container height={"full"}>content</Container>

				<Nav active="feed" />
			</Container>
		);
	},
});
