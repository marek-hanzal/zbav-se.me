import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import { withListingTransactionMessageCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";

export namespace MessageButton {
	export interface Props extends Button.Props {
		listingTransactionId: string;
	}
}

export const MessageButton: FC<MessageButton.Props> = ({ listingTransactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");

	const mutation = withListingTransactionMessageCreateMutation.useMutation();

	return (
		<>
			<Button
				iconEnabled={MessageIcon}
				iconPosition={"right"}
				menu
				label={"New message (label)"}
				size={"xl"}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					square={"md"}
				>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder={translator.text("Enter your message (placeholder)")}
						className={tvc([
							"bg-slate-100",
							"rounded-md",
							"p-2",
						])}
					/>

					<Button
						iconEnabled={MessageIcon}
						label={"Send message (label)"}
						full
						size={"xl"}
						onClick={() =>
							mutation.mutate({
								listingTransactionId,
								message,
							})
						}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
