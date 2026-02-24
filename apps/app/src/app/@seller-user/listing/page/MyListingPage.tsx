import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { ListingListContainer } from "~/app/@seller-user/listing/ui/ListingListContainer";
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
};
