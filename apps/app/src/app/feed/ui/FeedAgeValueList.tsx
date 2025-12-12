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
import { AgeSelection } from "~/app/age/ui/AgeSelection";

export namespace FeedAgeValueList {
	export interface Props {
		feed: tFeed;
	}
}

export const FeedAgeValueList: FC<FeedAgeValueList.Props> = ({ feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.ageIn?.map((item) => ({
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
				textTitle={"Feed age (label)"}
				textEmpty={"Feed age not selected"}
				items={selection.optional.multiId().map((id) => ({
					id,
					age: id,
				}))}
				renderFn={(item) => (
					<Tx
						label={`Condition - Age [${item.age}] (hint)`}
						ui={{
							tone: "secondary",
						}}
					/>
				)}
				action={<Icon icon={EditIcon} />}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				header={{
					close: true,
					title: "Feed age (title)",
				}}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
				>
					<AgeSelection selection={selection} />

					<Button
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate({
								patch: {
									...feed,
									query: {
										...feed.query,
										filter: {
											...feed.query?.filter,
											ageIn: selection.optional
												.multiId()
												.map((id) => Number.parseInt(id, 10)),
										},
									},
								},
								query: {
									where: {
										id: feed.id,
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
