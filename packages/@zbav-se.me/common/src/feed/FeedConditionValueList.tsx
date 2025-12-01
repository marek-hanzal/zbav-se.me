import { useSelection } from "@use-pico/client/hook";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { ConditionContainer } from "@zbav-se.me/common/condition";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { Rating } from "@zbav-se.me/ui/rating";
import { type FC, useState } from "react";

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
				render={(item) => <Tx label={`Condition - Overall [${item.condition}] (hint)`} />}
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
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"fit"}
					tone={"unset"}
					theme={"unset"}
					square={"md"}
					tweak={{
						slot: {
							root: {
								class: [
									"pt-14",
								],
							},
						},
					}}
				>
					<ConditionContainer selection={conditionSelection} />

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						full
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
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
