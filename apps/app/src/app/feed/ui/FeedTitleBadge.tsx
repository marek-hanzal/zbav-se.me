import { EditIcon, Icon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { FeedTitleContainer } from "./FeedTitleContainer";

export namespace FeedTitleBadge {
	export interface Props {
		feed: tFeed;
	}
}

export const FeedTitleBadge: FC<FeedTitleBadge.Props> = ({ feed }) => {
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
				textLabel={"Feed title (label)"}
				textValue={feed.query?.filter?.title || "Feed title not filled"}
				action={
					<Icon
						icon={EditIcon}
						size={"sm"}
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
					title: "Feed title (title)",
				}}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"full"}
				>
					<FeedTitleContainer
						value={patch.query?.filter?.title ?? ""}
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
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"xl"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate(patch);
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
