import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionEntryGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction-entry";
import { type FC, useState } from "react";
import { GalleryUploadButton } from "~/app/@common/gallery/ui/GalleryUploadButton";
import { LocationButton } from "~/app/v0/@common/location/ui/LocationButton";
import { PackageButton } from "~/app/v0/@common/package/ui/PackageButton";
import { PersonalButton } from "~/app/v0/@common/personal/ui/PersonalButton";
import { MessageButtonUi } from "~/app/v0/@common/transaction/ui/MessageButtonUi";

export namespace DisputeMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const DisputeMessage: FC<DisputeMessage.Props> = ({ transaction, ui, ...props }) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Group
			ui={{
				round: "default",
				flow: "vertical",
				tone: "link",
				...ui,
			}}
			{...props}
		>
			<PackageButton
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
				}}
				onCancel={() => {
					setIsGalleryOpen(false);
				}}
				{...MessageButtonUi}
			/>

			<LocationButton
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>

			<PersonalButton
				transactionId={transaction.id}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
