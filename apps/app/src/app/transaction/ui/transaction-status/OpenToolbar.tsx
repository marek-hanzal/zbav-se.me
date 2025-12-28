import { useQueryClient } from "@tanstack/react-query";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionMessageGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, useState } from "react";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";
import { DateButton } from "~/app/transaction/ui/button/DateButton";
import { LocationButton } from "~/app/transaction/ui/button/LocationButton";
import { PackageButton } from "~/app/transaction/ui/button/PackageButton";
import { PersonalButton } from "~/app/transaction/ui/button/PersonalButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";

export namespace OpenToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ transaction }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<>
			<GalleryUploadButton
				defaultUploadIds={[]}
				state={{
					value: isGalleryOpen,
					set: setIsGalleryOpen,
				}}
				withMutation={withTransactionMessageGalleryCreateMutation}
				toMutation={(uploadIds) => ({
					transactionId: transaction.id,
					uploadIds,
				})}
				onSuccess={() => {
					setIsGalleryOpen(false);
					withMessageThreadMessageCollectionQuery.invalidate(queryClient, {
						path: {
							messageThreadId: transaction.messageThreadId,
						},
					});
				}}
				onCancel={() => {
					setIsGalleryOpen(false);
				}}
				{...TransactionButtonUi}
			/>

			<LocationButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<PersonalButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<PackageButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<DateButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<RejectButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</>
	);
};
