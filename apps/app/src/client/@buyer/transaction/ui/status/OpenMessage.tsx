import { useQueryClient } from "@tanstack/react-query";
import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { type FC, useCallback, useState } from "react";
import { SellerInfoButton } from "~/client/@buyer/listing/~public/SellerInfoButton";
import { GalleryUploadButton } from "~/client/@common/gallery/ui/GalleryUploadButton";
import { MessageButtonUi } from "~/client/@user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import { LocationButton } from "~/client/@user/transaction-entry/ui/button/LocationButton";
import { PersonalButton } from "~/client/@user/transaction-entry/ui/button/PersonalButton";
import { withTransactionEntryGalleryCreateMutation } from "~/client/@user/transaction-entry/withTransactionEntryGalleryCreateMutation";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace OpenMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const OpenMessage: FC<OpenMessage.Props> = ({ close, transaction, ui, ...props }) => {
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
				<PersonalButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveInbox}
					{...MessageButtonUi}
				/>

				<LocationButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveInbox}
					{...MessageButtonUi}
				/>

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
