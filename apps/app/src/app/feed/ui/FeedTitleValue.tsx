import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { FeedTitleContainer } from "./FeedTitleContainer";

export namespace FeedTitleValue {
	export interface Props extends LabelValue.PropsEx {
		feed: tFeed;
	}
}

export const FeedTitleValue: FC<FeedTitleValue.Props> = ({ feed, ...props }) => {
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
				textLabel={"Feed title (label)"}
				textValue={feed.query?.filter?.title || "Feed title not filled"}
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
					title: "Feed title (title)",
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
					<FeedTitleContainer
						value={patch.patch.query?.filter?.title ?? ""}
						onChange={(title) => {
							setChange(true);
							setPatch((prev) => ({
								...prev,
								query: {
									...prev.query,
									filter: {
										...prev.query?.filter,
										title,
									},
								},
							}));
						}}
					/>

					<Button
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate(patch);
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
