import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { Suspense, useMemo } from "react";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		refetchInterval?: number;
	}
}

export const TransactionList = withFallback(
	({ _suspense, refetchInterval = 5_000, ui, ...props }: TransactionList.Props) => {
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
					{transactionCollection.map((transactionId) => {
						return (
							<Suspense
								key={transactionId}
								fallback={<Item.Fallback />}
							>
								<Item
									_suspense={"I know"}
									data-id={transactionId}
									transactionId={transactionId}
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
