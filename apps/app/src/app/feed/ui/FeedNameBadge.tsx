import { EditIcon, Icon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedNameBadge {
	export interface Props {
		feed: tFeed;
	}
}

export const FeedNameBadge: FC<FeedNameBadge.Props> = ({ feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>(feed);

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	return (
		<>
			<BadgeValue
				textLabel={"Feed name (label)"}
				textValue={feed.name}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							size: "sm",
						}}
					/>
				}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				header={{
					close: true,
					title: "Feed name (title)",
				}}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
				>
					<FeedNameContainer
						value={patch.name ?? ""}
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
