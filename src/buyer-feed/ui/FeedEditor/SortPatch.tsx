import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { ListingSortSelect } from "~/buyer-feed/ui/FeedEditor/ListingSortSelect";
import type { ListingSortSchema } from "~/buyer-listing/schema/ListingSortSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { Container } from "~/ui/ui/Container";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const [sort, setSort] = useState<ListingSortSchema.Type[]>(feed.query?.sort ?? []);

	return (
		<Container
			data-ui={"SortPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<ListingSortSelect
				state={{
					value: sort,
					set: setSort,
				}}
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
								sort,
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
