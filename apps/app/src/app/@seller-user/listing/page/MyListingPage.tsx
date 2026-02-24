import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { ListingListContainerSuspense } from "~/app/@seller-user/listing/ui/ListingListContainerSuspense";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

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
