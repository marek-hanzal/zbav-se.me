import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import type { FC } from "react";
import { match } from "ts-pattern";
import { OpenToolbar } from "~/app/transaction/ui/transaction-status/OpenToolbar";
import { PendingToolbar } from "~/app/transaction/ui/transaction-status/PendingToolbar";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
	transactionId,
	ui,
	...props
}) => {
	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			options={{
				refetchInterval: 2_500,
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data: transaction }) => {
				return (
					<Container
						ui={{
							scroll: "horizontal",
							width: "full",
							opacity: "low",
							...ui,
						}}
						className={[
							"py-1",
						]}
						{...props}
					>
						<Container
							ui={{
								gap: "default",
							}}
							className={[
								"grid",
								"grid-flow-col",
								"auto-cols-max",
								"w-max",
							]}
						>
							{match(transaction.status)
								.with("open", () => {
									return <OpenToolbar transaction={transaction} />;
								})
								.with("pending", () => {
									return <PendingToolbar transaction={transaction} />;
								})
								.with("rejected", "cancelled", "expired", "completed", () => {
									return "rejected-cancelled-expired";
								})
								.exhaustive()}
						</Container>
					</Container>
				);
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
