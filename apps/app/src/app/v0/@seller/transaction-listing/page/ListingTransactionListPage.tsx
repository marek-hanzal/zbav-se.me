import { VisibilityProvider } from "@use-pico/client/context";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { ListingSheet } from "~/app/v0/@seller/listing/ui/ListingSheet";
import { TransactionList } from "~/app/v0/@seller/transaction/ui/TransactionList";

export namespace ListingTransactionListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingTransactionListPage: FC<ListingTransactionListPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [detail, setDetail] = useState(false);
	const hero = useUpload(listing.gallery.items);

	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			textSubtitle={listing.title}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				<Container
					data-ui="ListingTransactionList-[HeroContainer]"
					ui={{
						position: "relative",
						height: "content",
					}}
					onClick={() => setDetail((prev) => !prev)}
				>
					<HeroImage
						src={hero.url}
						alt={`Hero image for listing ${listing.id}`}
						className={"h-42"}
					/>
				</Container>

				<TransactionList
					query={{
						where: {
							listingId,
						},
						sort: [
							{
								field: "status",
								order: "asc",
							},
							{
								field: "createdAt",
								order: "desc",
							},
						],
					}}
					ui={{
						inner: "default",
					}}
				/>
			</Container>

			<VisibilityProvider store={createNoopVisibilityStore()}>
				<ListingSheet
					listing={listing}
					state={{
						value: detail,
						set: setDetail,
					}}
				/>
			</VisibilityProvider>
		</TitleContainer>
	);
};
