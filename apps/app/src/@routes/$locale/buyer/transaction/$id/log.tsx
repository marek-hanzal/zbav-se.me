import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
import { ListingDetailContainer } from "@zbav-se.me/common/listing";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tGalleryItem, tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import {
	withListingFetchQuery,
	withListingTransactionFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HeroImage } from "@zbav-se.me/ui/img";
import { useId, useMemo, useState } from "react";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/log")({
	component() {
		const { locale, id } = Route.useParams();
		const detailSheetId = useId();
		const [detail, setDetail] = useState(false);

		const query: tListingTransactionLogQuery = useMemo(() => {
			return {
				where: {
					listingTransactionId: id,
				},
				sort: [
					{
						field: "createdAt",
						direction: "asc",
					},
				],
			};
		}, [
			id,
		]);

		return (
			<TitleContainer
				textTitle={"Transaction detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<withListingTransactionFetchQuery.Suspense
					data={{
						where: {
							id,
						},
						meta: {
							side: "buyer",
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						const [hero] = data.gallery.items as [
							tGalleryItem,
							...tGalleryItem[],
						];

						return (
							<Container
								layout="vertical-header-content"
								gap="md"
								height={"fit"}
							>
								<div
									className={tvc([
										"flex",
										"flex-col",
										"gap-1",
									])}
								>
									<div
										className={tvc([
											"w-full",
											"h-32",
										])}
									>
										<HeroImage
											ui={"ListingHero-image"}
											src={hero.upload.url}
											alt={`Hero image for listing transaction ${data.id}`}
											visible
											round
											onClick={() => setDetail((prev) => !prev)}
										/>

										<BottomSheet
											id={detailSheetId}
											isOpen={detail}
											onClose={() => setDetail(false)}
											detent={"full"}
										>
											<withListingFetchQuery.Suspense
												data={{
													where: {
														id: data.listingId,
													},
												}}
												fallback={<SpinnerContainer />}
											>
												{({ data }) => {
													return (
														<ListingDetailContainer
															parentSheetId={detailSheetId}
															locale={locale}
															listing={data}
															withScore
															square={"md"}
														/>
													);
												}}
											</withListingFetchQuery.Suspense>
										</BottomSheet>
									</div>

									<Typo
										label={data.title}
										wrap={"wrap"}
									/>
								</div>

								<TransactionLogList
									_suspense={"I know"}
									locale={locale}
									side="buyer"
									listingTransaction={data}
									query={query}
									height={"auto"}
								/>
							</Container>
						);
					}}
				</withListingTransactionFetchQuery.Suspense>
			</TitleContainer>
		);
	},
});
