import type { tTransactionMessage } from "@zbav-se.me/sdk/api/user";
import { withTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import type { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";

export namespace MessageMenu {
	export interface Props {
		type: useSideSwitch.Type;
		transactionMessage: tTransactionMessage;
		menuState: ChatInput.Menu.State;
	}
}

export const MessageMenu: FC<MessageMenu.Props> = ({
	type,
	transactionMessage,
	menuState,
}) => {
	const [, setMenuState] = menuState;
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							transactionId: transactionMessage.transactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
						}}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionMessage}
					/>
				</>
			);
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							transactionId: transactionMessage.transactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
						}}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionMessage}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							transactionId: transactionMessage.transactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
						}}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionMessage}
					/>
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							transactionId: transactionMessage.transactionId,
							uploadIds,
						})}
						onSuccess={() => {
							setMenuState(false);
						}}
						onCancel={() => {
							setMenuState(false);
						}}
						state={{
							value: isGalleryOpen,
							set: setIsGalleryOpen,
						}}
						ui={{
							tone: "secondary",
						}}
					/>

					<RejectButton
						menuState={menuState}
						log={transactionMessage}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
