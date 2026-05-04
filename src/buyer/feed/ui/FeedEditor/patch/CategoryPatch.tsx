import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { CategorySelect } from "~/user/category/ui/CategorySelect";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: feed.query?.filter?.categoryId
			? [
					{
						id: feed.query.filter.categoryId,
					},
				]
			: [],
		deps: [
			feed,
		],
	});

	const categoryId = selection.optional.singleId() ?? undefined;

	return (
		<Container
			data-ui={"CategoryPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<CategorySelect
				selection={selection}
				categoryId={categoryId}
				withRestriction={true}
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								filter: {
									...feed.query?.filter,
									categoryId: selection.optional.singleId(),
								},
								attrs: {},
							},
						},
					});
				}}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};
