import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionEntryGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction-entry";
import { type FC, useState } from "react";
import { SellerInfoButton } from "~/app/@buyer/listing/~public/SellerInfoButton";
import { GalleryUploadButton } from "~/app/@common/gallery/ui/GalleryUploadButton";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { LocationButton } from "~/app/@common/transaction-entry/ui/button/LocationButton";
import { PersonalButton } from "~/app/v0/@common/personal/ui/PersonalButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";

export namespace DisputeMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const DisputeMessage: FC<DisputeMessage.Props> = ({ close, transaction, ui, ...props }) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
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
				onSuccess={() => {
					setIsGalleryOpen(false);
				}}
				onCancel={() => {
					setIsGalleryOpen(false);
				}}
				{...MessageButtonUi}
			/>

			<LocationButton
				close={close}
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>

			<PersonalButton
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>

			<SellerInfoButton
				listingId={transaction.listingId}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
