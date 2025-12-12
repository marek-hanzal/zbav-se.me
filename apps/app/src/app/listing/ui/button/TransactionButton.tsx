import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { type FC, Suspense, useState } from "react";

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
	ui,
	...props
}) => {
	const [isTransaction, setIsTransaction] = useState(false);

	if (listing.transactionId) {
		return (
			<>
				<Button
					label={"View transactions (button)"}
					iconEnabled={TransactionIcon}
					onClick={() => setIsTransaction((prev) => !prev)}
					ui={{
						tone: "primary",
						theme: "light",
						size: "xl",
						justify: "start",
						...ui,
					}}
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
						<withTransactionFetchQuery.Suspense
							data={{
								where: {
									id: listing.transactionId,
								},
							}}
							fallback={<SpinnerContainer />}
						>
							{({ data }) => {
								return "messages here";
							}}
						</withTransactionFetchQuery.Suspense>
					</Suspense>
				</BottomSheet>
			</>
		);
	}

	return "TransactionCreateButton";
};
