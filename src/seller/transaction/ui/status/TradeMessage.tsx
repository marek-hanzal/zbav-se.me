import { useQueryClient } from "@tanstack/react-query";
import { type FC, useCallback, useState } from "react";
import type { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { GalleryUploadButton } from "~/common/gallery/ui/GalleryUploadButton";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { BuyerInfoButton } from "~/seller/transaction/ui/button/BuyerInfoButton";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryGalleryCreateMutation } from "~/user/transaction-entry/mutation/withTransactionEntryGalleryCreateMutation";
import { LocationButton } from "~/user/transaction-entry/ui/button/LocationButton";
import { PackageButton } from "~/user/transaction-entry/ui/button/PackageButton";
import { PersonalButton } from "~/user/transaction-entry/ui/button/PersonalButton";
import { archiveBuyerMessageActivity } from "../../service/archiveBuyerMessageActivity";

export namespace TradeMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TradeMessage: FC<TradeMessage.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	const archiveActivity = useCallback(async () => {
		await archiveBuyerMessageActivity({
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
		<>
			<Group
				data-ui={"TradeMessage"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="neutral"
				{...props}
			>
				<PackageButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveActivity}
					{...MessageButtonUi}
				/>

				<PersonalButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveActivity}
					{...MessageButtonUi}
				/>

				<LocationButton
					close={close}
					transactionId={transaction.id}
					onPostMutation={archiveActivity}
					{...MessageButtonUi}
				/>

				<GalleryUploadButton
					access="private"
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
						await archiveActivity();
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
				data-ui={"TradeMessage"}
				data-ui-round="default"
				data-ui-flow="vertical"
				data-ui-tone="neutral"
				{...props}
			>
				<BuyerInfoButton
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>
			</Group>
		</>
	);
};
