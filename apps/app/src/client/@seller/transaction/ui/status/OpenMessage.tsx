import { useQueryClient } from "@tanstack/react-query";
import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { type FC, useCallback, useState } from "react";
import { GalleryUploadButton } from "~/client/@common/gallery/ui/GalleryUploadButton";
import { MessageButtonUi } from "~/client/@user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryGalleryCreateMutation } from "~/client/@user/transaction-entry/mutation/withTransactionEntryGalleryCreateMutation";
import { LocationButton } from "~/client/@user/transaction-entry/ui/button/LocationButton";
import { PackageButton } from "~/client/@user/transaction-entry/ui/button/PackageButton";
import { PersonalButton } from "~/client/@user/transaction-entry/ui/button/PersonalButton";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
import { archiveBuyerMessageInbox } from "../../service/archiveBuyerMessageInbox";

export namespace OpenMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const OpenMessage: FC<OpenMessage.Props> = ({ close, transaction, ui, ...props }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	const archiveInbox = useCallback(async () => {
		await archiveBuyerMessageInbox({
			queryClient,
			transactionId: transaction.id,
			listingId: transaction.listingId,
		});
	}, [
		queryClient,
		transaction.id,
		transaction.listingId,
	]);

	return (
		<Group
			data-ui={"OpenMessage[Group]"}
			ui={{
				round: "default",
				flow: "vertical",
				tone: "link",
				...ui,
			}}
			{...props}
		>
			<PackageButton
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
	);
};
