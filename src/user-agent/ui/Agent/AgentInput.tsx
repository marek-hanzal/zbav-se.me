import { type FC, useState } from "react";
import { ChatInput } from "~/application-ui/ui/chat.exports";
import { withProxyMutation } from "~/gallery/mutation/withProxyMutation";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { GalleryUploadSheet } from "~/gallery/ui/GalleryUploadSheet";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import { Icon } from "~/ui/ui/Icon";
import { Typo } from "~/ui/ui/Typo";
import type { useAgent } from "~/user-agent/hook/useAgent";
import { withAgentTokensQuery } from "~/user-agent/query/withAgentTokensQuery";
import { AgentMenu } from "~/user-agent/ui/Agent/AgentMenu";
import { TokenUsage } from "~/user-agent/ui/TokenUsage";
import { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

export namespace AgentInput {
	export interface Props extends ChatInput.PropsEx {
		chat: useAgent.Use;
	}
}

export const AgentInput: FC<AgentInput.Props> = ({ chat, ...props }) => {
	const translator = useTranslator();
	const [isGalleryOpen, setIsGalleryOpenFn] = useState(false);
	const [uploads, setUploadsFn] = useState<UploadSchema.Type[]>([]);
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
					setFn: setIsGalleryOpenFn,
				}}
				withMutation={withProxyMutation}
				toMutationFn={(uploadIds) => ({
					uploadIds,
				})}
				onSuccessFn={async (result) => {
					setUploadsFn(result);
					setIsGalleryOpenFn(false);
				}}
				onCancelFn={() => {
					setIsGalleryOpenFn(false);
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
							setIsGalleryOpenFn(true);
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
								urls={uploads.map((upload) => upload.url)}
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
							onClick={chat.clearQueueFn}
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
					onSubmitFn={async (text) => {
						chat.submitFn(
							uploads.length > 0
								? chat.input.imageFn(
										text,
										uploads.map(({ url }) => url),
									)
								: chat.input.textFn(text),
						);
						setUploadsFn([]);
					}}
					placeholder={translator.textFn("Write to an agent")}
					loading={chat.isPending}
					disableSubmit={chat.isQueueFull}
					buttonProps={{
						"aria-label": translator.textFn("Send message to agent (aria)"),
					}}
					cancel={
						<Button
							data-action={"stop agent stream"}
							iconEnabled={"icon-[solar--stop-linear]"}
							onClick={chat.cancelFn}
							iconProps={{
								"data-ui-text": "xl",
							}}
							aria-label={translator.textFn("Cancel current agent work (aria)")}
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
							aria-label={translator.textFn("Open agent menu options (aria)")}
						>
							{(closeFn) => (
								<AgentMenu
									closeFn={closeFn}
									isPending={chat.isPending}
									galleryState={{
										value: isGalleryOpen,
										setFn: setIsGalleryOpenFn,
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
