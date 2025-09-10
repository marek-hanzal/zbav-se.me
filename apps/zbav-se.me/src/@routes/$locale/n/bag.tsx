import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/bag")({
	component() {
		return (
			<>
				<Title icon={BagIcon}>
					<Tx
						label={"My Bag (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<div className="flex-1">content</div>

				<Nav active="bag" />
			</>
		);
	},
});
