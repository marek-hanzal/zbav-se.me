import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { NameInput } from "../input/NameInput";

export namespace NameValue {
	export interface Props extends LabelValue.PropsEx {
		feed: tFeed;
	}
}

export const NameValue: FC<NameValue.Props> = ({ feed, ...props }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>({
		patch: feed,
		query: {
			where: {
				id: feed.id,
			},
		},
	});

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	return (
		<>
			<LabelValue
				data-ui={"NameValue[LabelValue]"}
				textLabel={"Feed name (label)"}
				textValue={feed.name}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				onClick={() => setIsEdit(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				header={({ close }) => ({
					title: "Feed name (title)",
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
				>
					<NameInput
						value={patch.patch.name ?? ""}
						ui={{
							height: "full",
						}}
						onChange={(name) => {
							setChange(true);
							setPatch((prev) => ({
								...prev,
								name,
							}));
						}}
						onSubmit={() => {
							toast.promise(feedPatchMutation.mutateAsync(patch), {
								loading: translator.text("Loading... (toast)"),
								success: translator.text("Feed name updated (toast)"),
								error: translator.text("Error updating feed name (toast)"),
							});
						}}
					/>

					<Button
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							toast.promise(feedPatchMutation.mutateAsync(patch), {
								loading: translator.text("Loading... (toast)"),
								success: translator.text("Feed name updated (toast)"),
								error: translator.text("Error updating feed name (toast)"),
							});
						}}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
