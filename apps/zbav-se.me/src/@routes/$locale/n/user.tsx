import { createFileRoute } from "@tanstack/react-router";
import {
	Button,
	ColumnLayout,
	ls,
	Scrollable,
	Tx,
	UserIcon,
} from "@use-pico/client";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/user")({
	component() {
		return (
			<ColumnLayout>
				<Title icon={UserIcon}>
					<Tx
						label={"User (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Scrollable layout="grid">
					<Button
						onClick={() => {
							ls.remove("intro");
							ls.remove("intro.listing");
						}}
					>
						<Tx label={"Reset tours (button)"} />
					</Button>
				</Scrollable>

				<Nav active="user" />
			</ColumnLayout>
		);
	},
});
