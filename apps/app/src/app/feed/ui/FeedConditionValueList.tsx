import { useSelection } from "@use-pico/client/hook";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { Rating } from "@zbav-se.me/ui/rating";
import { type FC, useState } from "react";
import { ConditionContainer } from "~/app/condition/ui/ConditionContainer";

export namespace FeedConditionValueList {
	export interface Props {
		feed: tFeed;
	}
}

export const FeedConditionValueList: FC<FeedConditionValueList.Props> = ({ feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const conditionSelection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.conditionIn?.map((item) => ({
			id: String(item),
		})),
		onMulti() {
			setChange(true);
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
			<ContainerValueList
				textTitle={"Feed condition (label)"}
				textEmpty={"Feed condition not selected"}
				items={conditionSelection.optional.multiId().map((id) => ({
					id,
					condition: id,
				}))}
				renderFn={(item) => (
					<Tx
						label={`Condition - Overall [${item.condition}] (hint)`}
						ui={{
							tone: "secondary",
						}}
					/>
				)}
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
					title: "Feed condition (title)",
				}}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
				>
					<ConditionContainer selection={conditionSelection} />

					<Button
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate({
								...feed,
								query: {
									...feed.query,
									filter: {
										...feed.query?.filter,
										conditionIn: conditionSelection.optional
											.multiId()
											.map((id) => Number.parseInt(id, 10)),
									},
								},
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
