import { createFileRoute } from "@tanstack/react-router";
import { Tx, UserIcon } from "@use-pico/client";
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
				dfgdfg
			</>
		);
	},
});
