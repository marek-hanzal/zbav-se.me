import { createFileRoute } from "@tanstack/react-router";
import { ColumnLayout, Scrollable, Tx } from "@use-pico/client";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/bag")({
	component() {
		return (
			<ColumnLayout>
				<Title icon={BagIcon}>
					<Tx
						label={"My Bag (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Scrollable>content</Scrollable>

				<Nav active="bag" />
			</ColumnLayout>
		);
	},
});
