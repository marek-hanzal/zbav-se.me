import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
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
			</>
		);
	},
});
