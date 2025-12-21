import { createLazyFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { List } from "~/app/listing/ui/my/List";

export const Route = createLazyFileRoute("/$locale/ui/seller/listing/my")({
	component() {
		return (
			<TitleContainer textTitle={"My listings (title)"}>
				<List
					query={{
						filter: {
							my: true,
						},
						sort: [
							{
								field: "createdAt",
								direction: "desc",
							},
						],
					}}
				/>
			</TitleContainer>
		)
	},
});
