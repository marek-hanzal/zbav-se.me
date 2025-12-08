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
				contentProps={{
					disableScroll: true,
				}}
				header={{
					close: true,
					title: "Feed category (title)",
				}}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"full"}
					square={"md"}
				>
					<CategorySelectionContainer
						locale={locale}
						selection={selection}
						categoryId={selection.optional.singleId()}
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"xl"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate({
								...feed,
								query: {
									...feed.query,
									filter: {
										...feed.query?.filter,
										categoryIdIn: selection.optional.multiId(),
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
