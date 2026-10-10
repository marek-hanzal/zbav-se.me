import { Suspense, useMemo } from "react";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { ActivityItem } from "../ActivityItem";
import { Empty } from "./Empty";

export namespace ActivityList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		priority: ActivityPriorityEnumSchema.Type;
		refetchInterval?: number;
	}
}

export const ActivityList = withFallback(
	({ _suspense, priority, refetchInterval = 5_000, ...props }: ActivityList.Props) => {
		const { data: activityCollection } = withActivityQuery.useIdsQuery(
			{
				where: {
					priority,
					archivedAtIsNull: true,
				},
				cursor: {
					page: 0,
					size: 1000,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
			},
			{
				refetchInterval,
			},
		);

		const check = useMemo(() => {
			return [
				{
					check() {
						return !activityCollection.length;
					},
					render() {
						return <Empty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			activityCollection,
		]);

		return (
			<Container
				data-ui="ActivityList[Container]"
				data-ui-flow="vertical"
				data-ui-gap="default"
				data-ui-height="full"
				data-ui-scroll="vertical"
				data-ui-inner="default"
				{...props}
			>
				<EmptyState check={check}>
					{activityCollection.map((activityId) => {
						return (
							<Suspense
								key={activityId}
								fallback={<ActivityItem.Fallback />}
							>
								<ActivityItem
									_suspense={"I know"}
									activityId={activityId}
								/>
							</Suspense>
						);
					})}
				</EmptyState>
			</Container>
		);
	},
	SpinnerContainer,
);
