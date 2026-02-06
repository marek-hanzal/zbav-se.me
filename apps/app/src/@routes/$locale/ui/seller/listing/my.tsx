import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingListContainer } from "~/app/@seller-user/listing/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/ui/seller/listing/my")({
	component() {
		return (
			<TitleContainer textTitle={"My listings (title)"}>
				<ListingListContainer
					query={{
						sort: [
							{
								field: "createdAt",
								order: "desc",
							},
						],
					}}
				/>
			</TitleContainer>
		);
	},
});
