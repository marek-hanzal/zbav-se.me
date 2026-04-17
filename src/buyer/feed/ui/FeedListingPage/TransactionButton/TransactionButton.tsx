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

export const TransactionButton: FC<TransactionButton.Props> = ({ listing, meta, ui, ...props }) => {
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
