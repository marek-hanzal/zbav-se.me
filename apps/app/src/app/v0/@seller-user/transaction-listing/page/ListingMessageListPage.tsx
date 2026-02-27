import { VisibilityProvider } from "@use-pico/client/context";
import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/seller-user/listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useHeroUpload } from "~/app/@common/gallery/hook/useHeroUpload";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { ListingSheet } from "~/app/v0/@seller-user/listing/ui/ListingSheet";
import { TransactionList } from "~/app/v0/@seller-user/transaction/ui/TransactionList";

export namespace ListingMessageListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingMessageListPage: FC<ListingMessageListPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	const locale = useLocale();
	const { data: listing } = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: listingId,
		},
	});

	const [detail, setDetail] = useState(false);
	const hero = useHeroUpload(listing.gallery.items);

	return (
		<TitleContainer
			data-ui="SellerMessageList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			textSubtitle={listing.title}
			left={
				<LinkTo
					icon={ChevronLeftIcon}
					to="/$locale/seller/message/list"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				<Container
					data-ui="MessageList-[HeroContainer]"
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
