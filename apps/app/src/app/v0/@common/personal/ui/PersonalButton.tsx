import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withMessageQuery } from "@zbav-se.me/sdk/query/user/message";
import { EmailIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PersonalControl } from "./PersonalControl";

export namespace PersonalButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({ transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withMessageQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			setIsOpen(false);
		},
	});

	return (
		<>
			<Button
				data-ui="PersonalButton[Button]"
				iconEnabled={EmailIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Share contact info (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"full"}
				withHeader
				header={() => ({
					title: "Share contact info (title)",
				})}
			>
				<PersonalControl
					data-ui="PersonalButton[PersonalControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ name, phone, email, locationId }) => {
						return mutation.mutateAsync({
							type: "personal",
							transactionId,
							name,
							phone,
							email,
							locationId,
						});
					}}
					loading={mutation.isPending}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
