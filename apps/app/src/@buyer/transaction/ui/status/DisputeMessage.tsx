import { useQueryClient } from "@tanstack/react-query";
import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { type FC, useCallback, useState } from "react";
import { SellerInfoButton } from "~/@buyer/listing/~public/SellerInfoButton";
import type { TransactionSchema } from "~/@buyer/transaction/server/schema/TransactionSchema";
import { GalleryUploadButton } from "~/@common/gallery/ui/GalleryUploadButton";
import { MessageButtonUi } from "~/@user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryGalleryCreateMutation } from "~/@user/transaction-entry/mutation/withTransactionEntryGalleryCreateMutation";
import { LocationButton } from "~/@user/transaction-entry/ui/button/LocationButton";
import { PersonalButton } from "~/@user/transaction-entry/ui/button/PersonalButton";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace DisputeMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const DisputeMessage: FC<DisputeMessage.Props> = ({ close, transaction, ui, ...props }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	const archiveInbox = useCallback(async () => {
		await archiveSellerMessageInbox({
			queryClient,
			transactionId: transaction.id,
		});
	}, [
		queryClient,
		transaction.id,
	]);

	return (
		<>
			<Group
				ui={{
					round: "default",
					flow: "vertical",
					tone: "primary",
					...ui,
				}}
				{...props}
			>
				<GalleryUploadButton
					defaultUploadIds={[]}
					state={{
						value: isGalleryOpen,
						set: setIsGalleryOpen,
					}}
					withMutation={withTransactionEntryGalleryCreateMutation}
					toMutation={(uploadIds) => ({
						transactionId: transaction.id,
						uploadIds,
					})}
					onSuccess={async () => {
						await archiveInbox();
						setIsGalleryOpen(false);
						close();
					}}
					onCancel={() => {
						setIsGalleryOpen(false);
					}}
					{...MessageButtonUi}
				/>

				<LocationButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveInbox}
					{...MessageButtonUi}
				/>

				<PersonalButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveInbox}
					{...MessageButtonUi}
				/>
			</Group>

			<Group
				ui={{
					round: "default",
					flow: "vertical",
					tone: "primary",
					...ui,
				}}
				{...props}
			>
				<SellerInfoButton
					listingId={transaction.listingId}
					{...MessageButtonUi}
				/>
			</Group>
		</>
	);
};
