import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { ConditionSelect } from "~/common/condition/ui/ConditionSelect";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { Rating } from "~/common/ui/rating";

export namespace ConditionPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.where?.conditionIn?.map((item) => ({
			id: String(item),
		})),
		deps: [
			feed,
		],
	});

	return (
		<Container
			data-ui={"ConditionPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<ConditionSelect
				selection={selection}
				allowClear
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
								where: {
									...feed.query?.where,
									conditionIn: selection.optional
										.multiId()
										.map((id) => Number.parseInt(id, 10)),
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
