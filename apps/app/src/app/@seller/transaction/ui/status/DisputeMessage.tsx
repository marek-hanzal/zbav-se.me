import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionEntryGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction-entry";
import { type FC, useState } from "react";
import { GalleryUploadButton } from "~/app/@common/gallery/ui/GalleryUploadButton";
import { MessageButtonUi } from "~/app/@common/transaction/ui";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { LocationButton } from "~/app/@common/transaction-entry/ui/button/LocationButton";
import { PackageButton } from "~/app/v0/@common/package/ui/PackageButton";
import { PersonalButton } from "~/app/v0/@common/personal/ui/PersonalButton";

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
			data-ui={"DisputeMessage[Group]"}
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
				onSuccess={() => {
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
				{...MessageButtonUi}
			/>

			<PersonalButton
				close={close}
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
