import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { Button, uiButton } from "@/lib/client/button";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { TransactionIcon } from "~/common/ui/icon";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		listing: ListingSchema.Type;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({ listing, meta, ...props }) => {
	const locale = useLocale();
	const queryClient = useQueryClient();
	const updateListing = withListingQuery.useUpdate();
	const transactionCreateMutation = withTransactionQuery.useCreateMutation({
		async onPostMutation() {
			/**
			 * We've to manually refetch listing with meta and update it.
			 *
			 * I'm not proud of this solution, but it's at least interesting to see,
			 * how nicely the stuff here works as a lego.
			 */
			updateListing(
				await withListingQuery.fetchFn({
					where: {
						id: listing.id,
					},
					meta,
				}),
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
					"data-ui-text": "xl",
				}}
				{...uiButton({
					name: "TransactionButton",
					"data-ui-justify": "space-between",
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
					"data-ui-size": "default",
					"data-ui-text": "lg",
				})}
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
				"data-ui-text": "xl",
			}}
			disabled={transactionCreateMutation.isPending}
			loading={transactionCreateMutation.isPending}
			onClick={() => {
				transactionCreateMutation.mutate({
					listingId: listing.id,
				});
			}}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-size="default"
			data-ui-text="lg"
			{...props}
		>
			<Tx label="Create transaction (button)" />
		</Button>
	);
};
