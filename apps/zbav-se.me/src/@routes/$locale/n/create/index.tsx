import { createFileRoute } from "@tanstack/react-router";
import { Scrollable, Tx } from "@use-pico/client";
import { CategoryListWrapper } from "~/app/category-group/ui/CategoryListWrapper";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/create/")({
	component() {
		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell - Category Group List (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Scrollable>
					<CategoryListWrapper />
				</Scrollable>

				<Nav active="create" />
			</>
		);
	},
});
