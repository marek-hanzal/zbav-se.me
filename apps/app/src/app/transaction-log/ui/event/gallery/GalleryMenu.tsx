import type { tTransactionGallery } from "@zbav-se.me/sdk/api/user";
import { withTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import type { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";
import { GalleryUploadButton } from "~/app/photo/ui/GalleryUploadButton";

export namespace GalleryMenu {
	export interface Props {
		type: useSideSwitch.Type;
		menuState: ChatInput.Menu.State;
		transactionGallery: tTransactionGallery;
	}
}

export const GalleryMenu: FC<GalleryMenu.Props> = ({ type, transactionGallery, menuState }) => {
	const [, setMenuState] = menuState;
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return match(type)
		.with("buyer", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						toMutation={(uploadIds) => ({
							transactionId: transactionGallery.transactionId,
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
						log={transactionGallery}
					/>
				</>
			);
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						ui={{
							tone: "secondary",
						}}
						toMutation={(uploadIds) => ({
							transactionId: transactionGallery.transactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={transactionGallery}
					/>
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<GalleryUploadButton
						withMutation={withTransactionGalleryCreateMutation}
						ui={{
							tone: "secondary",
						}}
						toMutation={(uploadIds) => ({
							transactionId: transactionGallery.transactionId,
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
					/>

					<RejectButton
						menuState={menuState}
						log={transactionGallery}
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
							transactionId: transactionGallery.transactionId,
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
						log={transactionGallery}
					/>
				</>
			);
		})
		.with("unknown", () => {
			return "unknown";
		})
		.exhaustive();
};
