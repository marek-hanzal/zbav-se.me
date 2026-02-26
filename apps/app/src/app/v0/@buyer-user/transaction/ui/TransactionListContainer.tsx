import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC, ReactNode } from "react";

export namespace TransactionListContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionQuery;
		renderItem(transactionId: string): ReactNode;
		refetchInterval?: number;
	}
}

export const TransactionListContainer: FC<TransactionListContainer.Props> = ({
	_suspense,
	query,
	renderItem,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const locale = useLocale();
	const { data } = withTransactionQuery.useCollectionQuery(query, {
		refetchInterval,
	});
	const { data: transactionCount } = withTransactionQuery.useCount(query);

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{transactionCount.isEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No transactions as buyer (title)")}
						textMessage={translator.text("No transactions as buyer (message)")}
						action={
							<LinkTo
								icon={ChevronRightIcon}
								iconPosition={"right"}
								to="/$locale/buyer/feed/default"
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
								<Tx label="Go to my feed (button)" />
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
			) : transactionCount.isFilterEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No transactions for current filter (title)")}
						textMessage={translator.text(
							"No transactions for current filter (message)",
						)}
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
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					{data.map((transactionId) => renderItem(transactionId))}
				</Container>
			)}
		</Container>
	);
};
