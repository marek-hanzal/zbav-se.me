import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";
import { CancelIcon } from "~/common/ui/icon";
import { HeroImage } from "~/common/ui/img";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import type { useAgent } from "../../hook/useAgent";
import { AgentMenu } from "./AgentMenu";

export namespace AgentInput {
	export interface Props extends ChatInput.PropsEx {
		chat: useAgent.Use;
	}
}

export const AgentInput: FC<AgentInput.Props> = ({ chat, ...props }) => {
	const [uploads, setUploads] = useState<string[]>([]);

	console.log("Some uploads?", uploads);

	return (
		<Container>
			{uploads.length > 0 ? (
				<Container className={"min-h-24"}>
					<HeroImage src={uploads[0]} />
				</Container>
			) : null}

			<ChatInput
				data-ui-width="full"
				data-ui-inner="default"
				onSubmit={chat.submit}
				placeholder={translator.text("Write to an agent")}
				loading={chat.mutation.isPending}
				cancel={
					<Button
						data-action={"stop agent stream"}
						iconEnabled={CancelIcon}
						onClick={chat.cancel}
						iconProps={{
							"data-ui-text": "xl",
						}}
						data-ui-justify="center"
						data-ui-items="center"
						data-ui-tone="brand"
						data-ui-theme="light"
						data-ui-square="default"
						data-ui-background={undefined}
						data-ui-border={false}
						data-ui-shadow={false}
						data-ui-color="lead"
					/>
				}
				left={
					<TransactionMenuButton>
						{(close) => (
							<AgentMenu
								close={close}
								onUpload={setUploads}
							/>
						)}
					</TransactionMenuButton>
				}
				{...props}
			/>
		</Container>
	);
};
