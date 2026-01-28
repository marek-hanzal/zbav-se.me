import { useQueryClient } from "@tanstack/react-query";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionMessageGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";
import { LocationButton } from "~/app/transaction/ui/button/LocationButton";
import { PackageButton } from "~/app/transaction/ui/button/PackageButton";
import { PersonalButton } from "~/app/transaction/ui/button/PersonalButton";
import { MessageButtonUi } from "~/app/transaction/ui/transaction-status/MessageButtonUi";
import { useSide } from "~/app/user/useSide";

export namespace DisputeMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const DisputeMessage: FC<DisputeMessage.Props> = ({ transaction, ui, ...props }) => {
	const queryClient = useQueryClient();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const side = useSide();

	return (
		<Container
			ui={{
				round: "default",
				flow: "vertical",
				gap: "default",
				...match<typeof side, uiContainer.Ui>(side)
					.with("seller", () => {
						return {
							tone: "link",
						};
					})
					.with("buyer", () => {
						return {
							tone: "primary",
						};
					})
					.with(null, undefined, () => {
						return {};
					})
					.exhaustive(),
				...ui,
			}}
			className={[
				"w-2/3",
				"ml-auto",
			]}
			{...props}
		>
			{side === "seller" ? (
				<PackageButton
					transaction={transaction}
					{...MessageButtonUi}
				/>
			) : null}

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

			<LocationButton
				transaction={transaction}
				{...MessageButtonUi}
			/>

			<PersonalButton
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Container>
	);
};
