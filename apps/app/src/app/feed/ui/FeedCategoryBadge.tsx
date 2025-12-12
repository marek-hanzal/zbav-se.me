import { useSelection } from "@use-pico/client/hook";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { CategorySelectionContainer } from "~/app/category/ui/CategorySelectionContainer";
import { CategoryValueList } from "~/app/category/ui/CategoryValueList";

export namespace FeedCategoryBadge {
	export interface Props {
		locale: string;
		feed: tFeed;
	}
}

export const FeedCategoryBadge: FC<FeedCategoryBadge.Props> = ({ locale, feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
			id,
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
			<CategoryValueList
				categoryIdIn={selection.optional.multiId()}
				textTitle={"Feed category (label)"}
				textEmpty={"Feed category not selected"}
				action={<Icon icon={EditIcon} />}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				contentProps={{
					disableScroll: true,
				}}
				header={{
					close: true,
					title: "Feed category (title)",
				}}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
				>
					<CategorySelectionContainer
						locale={locale}
						selection={selection}
						categoryId={selection.optional.singleId()}
					/>

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
											categoryIdIn: selection.optional.multiId(),
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
