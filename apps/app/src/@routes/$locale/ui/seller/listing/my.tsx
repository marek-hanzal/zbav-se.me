import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { List } from "~/app/listing/ui/my/List";

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
						cursor: {
							page: 0,
							/**
							 * Maximum limit of active listings
							 */
							size: 200,
						},
					}}
				/>
			</TitleContainer>
		);
	},
});
