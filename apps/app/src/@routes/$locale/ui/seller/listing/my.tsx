import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { List } from "~/app/@seller-user/listing/ui/my/List";

export const Route = createFileRoute("/$locale/ui/seller/listing/my")({
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
		);
	},
});
