import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { type FC, type ReactNode, useMemo } from "react";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		renderItem(transactionId: string): ReactNode;
		refetchInterval?: number;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	renderItem,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data: transactionCollection } = withTransactionQuery.useCollectionQuery(
		{
			sort: [
				{
					field: "status",
					order: "asc",
				},
				{
					field: "createdAt",
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
					return !transactionCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		transactionCollection,
	]);

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<EmptyState check={check}>
				{transactionCollection.map((transactionId) => renderItem(transactionId))}
			</EmptyState>
		</Container>
	);
};
