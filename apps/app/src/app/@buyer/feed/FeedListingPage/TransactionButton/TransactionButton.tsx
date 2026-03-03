import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionCreateMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		listing: tListing;
		onView(view: "transaction"): void;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({
	listing,
	ui,
	onView,
	...props
}) => {
	const queryClient = useQueryClient();
	const transactionCreateMutation = withTransactionCreateMutation.useMutation({
		async onSuccess() {
			await withListingQuery.invalidator(
				queryClient,
				[
					"fetch",
				],
				{
					fetch: {
						where: {
							id: listing.id,
						},
					},
				},
			);
		},
	});

	if (listing.transactionId) {
		return (
			<Button
				iconEnabled={TransactionIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					...ui,
				}}
				onClick={() => onView("transaction")}
				{...props}
			>
				<Tx label="View transactions (button)" />
			</Button>
		);
	}

	return (
		<Button
			iconEnabled={TransactionIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			disabled={transactionCreateMutation.isPending}
			loading={transactionCreateMutation.isPending}
			onClick={() => {
				transactionCreateMutation.mutate({
					listingId: listing.id,
				});
			}}
			ui={{
				tone: "secondary",
				theme: "light",
				size: "default",
				text: "lg",
				...ui,
			}}
			{...props}
		>
			<Tx label="Create transaction (button)" />
		</Button>
	);
};
