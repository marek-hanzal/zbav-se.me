import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { ListingList } from "~/app/@seller-user/listing/ui/ListingList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace MyListingPage {
	export interface Props extends TitleContainer.Props {}
}

/**
 * Composes the seller listings page with heading chrome and default query for newest listings first.
 * Use it as the route-level entry screen for managing a seller account listing portfolio.
 *
 * @see apps/app/src/@routes
 */
export const MyListingPage: FC<MyListingPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("My listings (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<ListingList
				query={{
					cursor: {
						page: 0,
						size: 100,
					},
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
