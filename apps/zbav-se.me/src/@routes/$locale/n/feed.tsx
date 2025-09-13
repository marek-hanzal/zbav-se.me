import { createFileRoute } from "@tanstack/react-router";
import { ColumnLayout, Scrollable, Tx } from "@use-pico/client";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/feed")({
	component() {
		return (
			<ColumnLayout>
				<Title icon={FeedIcon}>
					<Tx
						label={"Feed (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Scrollable>content</Scrollable>

				<Nav active="feed" />
			</ColumnLayout>
		);
	},
});
