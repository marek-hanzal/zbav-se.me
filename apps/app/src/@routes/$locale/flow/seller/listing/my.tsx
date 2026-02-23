import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingListContainer } from "~/app/@seller-user/listing/ui/ListingListContainer";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/seller/listing/my")({
	component() {
		return (
			<TitleContainer
				textTitle={translator.text("My listings (title)")}
				right={<HomeMenuButton />}
			>
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
