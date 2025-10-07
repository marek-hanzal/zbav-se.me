import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, ls, Tx, UserIcon } from "@use-pico/client";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/user")({
	component() {
		return (
			<Container layout={"vertical"}>
				<Title icon={UserIcon}>
					<Tx
						label={"User (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Container height={"full"}>
					<Button
						onClick={() => {
							ls.remove("intro");
							ls.remove("intro.listing");
						}}
					>
						<Tx label={"Reset tours (button)"} />
					</Button>
				</Container>

				<Nav active="user" />
			</Container>
		);
	},
});
