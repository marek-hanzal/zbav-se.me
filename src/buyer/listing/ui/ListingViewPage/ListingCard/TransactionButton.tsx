import type { FC } from "react";
import { Button, uiButton } from "@/lib/client/button";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { TransactionIcon } from "~/common/ui/icon";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		listing: ListingSchema.Type;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({ listing, ...props }) => {
	const locale = useLocale();
	const transactionCreateMutation = withTransactionQuery.useCreateMutation();

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
					meta: undefined,
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
