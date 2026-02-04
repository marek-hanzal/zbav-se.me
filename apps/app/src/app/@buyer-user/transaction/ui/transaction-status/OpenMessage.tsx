import { useQueryClient } from "@tanstack/react-query";
import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionMessageGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, useState } from "react";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";
import { LocationButton } from "~/app/transaction/ui/button/LocationButton";
import { PersonalButton } from "~/app/transaction/ui/button/PersonalButton";
import { MessageButtonUi } from "~/app/transaction/ui/transaction-status/MessageButtonUi";

export namespace OpenMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const OpenMessage: FC<OpenMessage.Props> = ({ transaction, ui, ...props }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			ui={{
				round: "default",
				flow: "vertical",
				gap: "default",
				tone: "primary",
				...ui,
			}}
			className={[
				"w-2/3",
				"ml-auto",
			]}
			{...props}
		>
			<PersonalButton
				transaction={transaction}
				{...MessageButtonUi}
			/>

			<LocationButton
				transaction={transaction}
				{...MessageButtonUi}
			/>

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
				{...MessageButtonUi}
			/>
		</Container>
	);
};
