import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { Item } from "./Item";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionQuery;
		refetchInterval?: number;
	}
}

type tEmptyStateProps = {
	query: tTransactionQuery;
};

const EmptyState: FC<tEmptyStateProps> = ({ query }) => {
	const locale = useLocale();
	const { data: transactionCount } = withTransactionQuery.useCountQuery(query);

	return transactionCount.isEmpty ? (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={MessageIcon}
				textTitle={translator.text("No transactions as seller (title)")}
				textMessage={translator.text("No transactions as seller (message)")}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to="/$locale/seller/listing/my"
						params={{
							locale,
						}}
						ui={{
							background: "default",
							border: true,
							shadow: true,
							round: "default",
							size: "default",
						}}
					>
						<Tx label="Go to my listings (button)" />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	) : (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={MessageIcon}
				textTitle={translator.text("No transactions for current filter (title)")}
				textMessage={translator.text("No transactions for current filter (message)")}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	query,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const { data } = withTransactionQuery.useCollectionQuery(query, {
		refetchInterval,
	});

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{data.length > 0 ? (
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					{data.map((transactionId) => {
						return (
							<Item
								key={transactionId}
								data-id={transactionId}
								_suspense={_suspense}
								transactionId={transactionId}
							/>
						);
					})}
				</Container>
			) : (
				<EmptyState query={query} />
			)}
		</Container>
	);
};
