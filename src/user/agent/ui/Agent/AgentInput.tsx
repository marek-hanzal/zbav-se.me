import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withProxyMutation } from "~/common/gallery/mutation/withProxyMutation";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { GalleryUploadSheet } from "~/common/gallery/ui/GalleryUploadSheet";
import { ChatInput } from "~/common/ui/chat";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import type { useAgent } from "../../hook/useAgent";
import { withAgentTokensQuery } from "../../query/withAgentTokensQuery";
import { TokenUsage } from "../TokenUsage";
import { AgentMenu } from "./AgentMenu";

export namespace AgentInput {
	export interface Props extends ChatInput.PropsEx {
		chat: useAgent.Use;
	}
}

export const AgentInput: FC<AgentInput.Props> = ({ chat, ...props }) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [uploads, setUploads] = useState<UploadSchema.Type[]>([]);
	const uploadIds = uploads.map(({ id }) => id);
	const { data: tokens } = withAgentTokensQuery.useSuspenseQuery({
		where: {
			threadId: chat.threadId,
		},
	});

	return (
		<>
			<GalleryUploadSheet
				key={uploadIds.join(":")}
				allowClear
				access="private"
				state={{
					value: isGalleryOpen,
					set: setIsGalleryOpen,
				}}
				withMutation={withProxyMutation}
				toMutation={(uploadIds) => ({
					uploadIds,
				})}
				onSuccess={async (result) => {
					setUploads(result);
					setIsGalleryOpen(false);
				}}
				onCancel={() => {
					setIsGalleryOpen(false);
				}}
				defaultUploadIds={uploadIds}
				detent={"default"}
				limit={5}
			/>

			<Container
				data-ui-inner={"default"}
				data-ui-snap-to={"bottom-center"}
				data-ui-flow={"vertical"}
				data-ui-width={"full"}
				data-ui-position={"relative"}
				className={[
					"bottom-0",
					"pb-0",
				]}
			>
				{uploads.length > 0 ? (
					<Container
						className={[
							"h-32",
							"translate-y-[20%]",
							"relative",
						]}
						data-ui-inner={"default"}
						onClick={() => {
							setIsGalleryOpen(true);
						}}
					>
						<Container
							data-ui-tone={"neutral"}
							data-ui-theme={"light"}
							data-ui-border
							data-ui-height={"full"}
							data-ui-round={"default"}
						>
							<GalleryPreview
								uploads={uploads}
								data-ui-inner={undefined}
							/>
						</Container>
					</Container>
				) : null}

				{chat.queueText ? (
					<Container
						data-ui={"AgentInput-[Queue]"}
						data-ui-inner={"sm"}
						data-ui-flow={"horizontal"}
						data-ui-items={"center"}
						data-ui-gap={"default"}
						data-ui-tone={"neutral"}
						data-ui-theme={"light"}
						data-ui-background={"default"}
						data-ui-border
						data-ui-round={"default"}
						className={[
							"translate-y-[20%]",
							"relative",
							"mx-2",
						]}
						data-ui-opacity={"8"}
					>
						<Icon
							icon={"icon-[solar--clock-circle-linear]"}
							data-ui-text={"lg"}
							data-ui-opacity={"4"}
						/>

						<Typo
							label={chat.queueText}
							data-ui={"AgentInput-[QueueText]"}
							data-ui-width={"full"}
							data-ui-text={"sm"}
							data-ui-truncate
							data-ui-opacity={"6"}
						/>

						<Button
							data-action={"clear queued agent messages"}
							iconEnabled={"icon-[solar--close-circle-linear]"}
							onClick={chat.clearQueue}
							iconProps={{
								"data-ui-text": "lg",
							}}
							data-ui-justify="center"
							data-ui-items="center"
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-square="sm"
							data-ui-background={undefined}
							data-ui-border={false}
							data-ui-shadow={false}
							data-ui-color="lead"
						/>
					</Container>
				) : null}

				<ChatInput
					className={[
						"relative",
					]}
					onSubmit={async (text) => {
						chat.submit(
							uploads.length > 0
								? chat.input.image(
										text,
										uploads.map(({ url }) => url),
									)
								: chat.input.text(text),
						);
						setUploads([]);
					}}
					placeholder={translator.text("Write to an agent")}
					loading={chat.isPending}
					disableSubmit={chat.isQueueFull}
					buttonProps={{
						"aria-label": translator.text("Send message to agent (aria)"),
					}}
					cancel={
						<Button
							data-action={"stop agent stream"}
							iconEnabled={"icon-[solar--stop-linear]"}
							onClick={chat.cancel}
							iconProps={{
								"data-ui-text": "xl",
							}}
							aria-label={translator.text("Cancel current agent work (aria)")}
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
						<TransactionMenuButton
							aria-label={translator.text("Open agent menu options (aria)")}
						>
							{(close) => (
								<AgentMenu
									close={close}
									isPending={chat.isPending}
									galleryState={{
										value: isGalleryOpen,
										set: setIsGalleryOpen,
									}}
								/>
							)}
						</TransactionMenuButton>
					}
					{...props}
				/>

				<Container
					data-ui-flow={"horizontal"}
					data-ui-items={"center"}
					data-ui-justify={"end"}
					data-ui-inner={"xs"}
					data-ui-gap={"default"}
					className={[
						"pb-0",
					]}
				>
					{tokens.total > 0 ? (
						<Tx
							label={"Thread token usage (label)"}
							data-ui-text={"xs"}
							data-ui-opacity={"3"}
						/>
					) : (
						<div />
					)}

					<TokenUsage
						threadId={chat.threadId}
						data-ui-text={"xs"}
						data-ui-opacity={"4"}
					/>
				</Container>
			</Container>
		</>
	);
};
