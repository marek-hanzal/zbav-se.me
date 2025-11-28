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
				tone={"link"}
				theme={"light"}
				size={"lg"}
				round={"full"}
				onClick={() => setIsOpen((prev) => !prev)}
				disabled={mutation.isPending}
				loading={mutation.isPending}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"content"}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					square={"md"}
				>
					<div className="min-h-0">
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder={translator.text("Enter your message (placeholder)")}
							className={tvc([
								"bg-slate-100",
								"rounded-md",
								"p-2",
								"focus:outline-rose-100",
								"w-full",
								"min-h-0",
								"max-h-32",
								"shrink",
								"resize-none",
							])}
							rows={4}
						/>
					</div>

					<Button
						iconEnabled={MessageIcon}
						tone={"primary"}
						theme={"light"}
						label={"Send message (label)"}
						full
						size={"xl"}
						disabled={mutation.isPending}
						loading={mutation.isPending}
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
