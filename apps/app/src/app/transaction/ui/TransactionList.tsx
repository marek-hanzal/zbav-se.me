import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/user";
import { withTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { type FC } from "react";
import { TransactionItem } from "~/app/transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		locale: string;
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ locale, query, ui, ...props }) => {
	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<withTransactionCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data: { data } }) => {
					return (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.map(({ id }) => (
								<TransactionItem
									key={id}
									data-id={id}
									transactionId={id}
								/>
							))}
						</Container>
					);
				}}
			</withTransactionCollectionQuery.Suspense>
		</Container>
	);
};
