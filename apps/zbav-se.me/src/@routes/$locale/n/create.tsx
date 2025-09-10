import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>
				blabla
			</>
		);
	},
});
