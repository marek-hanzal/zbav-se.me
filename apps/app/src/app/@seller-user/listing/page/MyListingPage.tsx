import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { ListingList } from "~/app/@seller-user/listing/ui/ListingList";

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
			<ListingList
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
