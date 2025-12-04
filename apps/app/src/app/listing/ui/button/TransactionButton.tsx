import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { type FC, Suspense, useState } from "react";
import { ListingTransactionCreateButton } from "~/app/listing-transaction/ui/button/ListingTransactionCreateButton";
import { TransactionLogList } from "~/app/listing-transaction-log/ui/TransactionLogList";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		locale: string;
		listing: tListing;
		parentSheetId: string | undefined;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({
	locale,
	listing,
	parentSheetId,
	...props
}) => {
	const [isTransaction, setIsTransaction] = useState(false);

	if (listing.transactionId) {
		return (
			<>
				<Button
					tone={"primary"}
					label={"View transactions (button)"}
					iconEnabled={TransactionIcon}
					theme={"light"}
					size={"xl"}
					onClick={() => setIsTransaction((prev) => !prev)}
					menu
					{...props}
				/>

				<BottomSheet
					isOpen={isTransaction}
					onClose={() => setIsTransaction(false)}
					detent={"default"}
					contentProps={{
						disableScroll: true,
					}}
					modalEffectRootId={parentSheetId}
					header={{
						close: true,
						title: "Listing transactions (title)",
					}}
				>
					<Suspense fallback={<SpinnerContainer />}>
						<withListingTransactionFetchQuery.Suspense
							data={{
								where: {
									id: listing.transactionId,
								},
							}}
							fallback={<SpinnerContainer />}
						>
							{({ data }) => {
								return (
									<TransactionLogList
										_suspense={"I know"}
										noHero
										locale={locale}
										side="buyer"
										listingTransaction={data}
										query={{
											where: {
												listingTransactionId: data.id,
											},
											sort: [
												{
													field: "createdAt",
													direction: "asc",
												},
											],
										}}
									/>
								);
							}}
						</withListingTransactionFetchQuery.Suspense>
					</Suspense>
				</BottomSheet>
			</>
		);
	}

	return (
		<ListingTransactionCreateButton
			tone={"primary"}
			listing={listing}
			{...props}
		/>
	);
};
