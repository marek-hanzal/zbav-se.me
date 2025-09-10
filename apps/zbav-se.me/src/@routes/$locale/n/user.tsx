import { createFileRoute } from "@tanstack/react-router";
import { Tx, UserIcon } from "@use-pico/client";
import { Content } from "~/app/ui/content/Content";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/user")({
	component() {
		return (
			<>
				<Title icon={UserIcon}>
					<Tx
						label={"User (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Content>content</Content>

				<Nav active="user" />
			</>
		);
	},
});
