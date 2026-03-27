import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Button, uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { withListingQuery } from "~/@buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/@buyer/listing/server/schema/ListingSchema";
import { withTransactionQuery } from "~/@buyer/transaction/query/withTransactionQuery";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		listing: ListingSchema.Type;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({ listing, ui, ...props }) => {
	const locale = useLocale();
	const queryClient = useQueryClient();
	const transactionCreateMutation = withTransactionQuery.useCreateMutation({
		async onPostMutation() {
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
			await withTransactionQuery.invalidator(queryClient, [
				"collection",
				"count",
			]);
		},
	});

	if (listing.transactionId) {
		return (
			<LinkTo
				to={"/$locale/app/buyer/transaction/$transactionId/detail"}
				params={{
					locale,
					transactionId: listing.transactionId,
				}}
				icon={ChevronRightIcon}
				iconPosition={"right"}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				{...uiButton({
					ui: {
						justify: "space-between",
						tone: "neutral",
						theme: "light",
						size: "default",
						text: "lg",
					},
					className: [],
				})}
				data-ui={"TransactionButton"}
				data-action={"open transactions"}
			>
				<Tx label="View transactions (button)" />
			</LinkTo>
		);
	}

	return (
		<Button
			data-ui={"TransactionButton"}
			data-action={"create transaction"}
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
