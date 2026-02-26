import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { ListingListContainerSuspense } from "~/app/v0/@seller-user/listing/ui/ListingListContainerSuspense";

export namespace MyListingPage {
	export interface Props extends TitleContainer.Props {}
}

export const MyListingPage: FC<MyListingPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("My listings (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<ListingListContainerSuspense
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
};
