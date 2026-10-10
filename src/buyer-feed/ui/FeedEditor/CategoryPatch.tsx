import type { FC } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";
import { CategorySelect } from "~/user-category/ui/CategorySelect/index";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettledFn?(): void;
		onCancelFn(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({
	feed,
	onSettledFn,
	onCancelFn,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: feed.query?.where?.categoryId
			? [
					{
						id: feed.query.where.categoryId,
					},
				]
			: [],
		deps: [
			feed,
		],
	});

	const categoryId = selection.optional.singleIdFn() ?? undefined;

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
				onCancelFn={onCancelFn}
				onSaveFn={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								where: {
									...feed.query?.where,
									categoryId: selection.optional.singleIdFn(),
									attrs: {},
								},
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
