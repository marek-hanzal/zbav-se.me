import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import { Suspense, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";
import { InboxItem } from "../InboxItem";
import { Empty } from "./Empty";

export namespace InboxList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		priority: InboxPriorityEnumSchema.Type;
		refetchInterval?: number;
	}
}

export const InboxList = withFallback(
	({ _suspense, priority, refetchInterval = 5_000, ...props }: InboxList.Props) => {
		const { data: inboxCollection } = withInboxQuery.useCollectionQuery(
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
						return !inboxCollection.length;
					},
					render() {
						return <Empty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			inboxCollection,
		]);

		return (
			<Container
				data-ui="InboxList[Container]"
				ui={{
					flow: "vertical",
					gap: "default",
					height: "full",
					scroll: "vertical",
					inner: "default",
				}}
				{...props}
			>
				<EmptyState check={check}>
					{inboxCollection.map((inboxId) => {
						return (
							<Suspense
								key={inboxId}
								fallback={<InboxItem.Fallback />}
							>
								<InboxItem
									_suspense={"I know"}
									inboxId={inboxId}
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
