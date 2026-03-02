import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller-user/transaction-listing";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { TransactionListingItemSuspense } from "./TransactionListingItemSuspense";

export namespace TransactionListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tTransactionListingQuery;
		refetchInterval?: number;
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	_suspense,
	query,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const locale = useLocale();
	const { data } = withTransactionListingQuery.useCollectionQuery(query, {
		refetchInterval,
	});
	const { data: transactionListingCount } = withTransactionListingQuery.useCountQuery(query);

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{transactionListingCount.isEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No listings with transactions (title)")}
						textMessage={translator.text("No listings with transactions (message)")}
						action={
							<LinkTo
								icon={ChevronRightIcon}
								iconPosition={"right"}
								to={"/$locale/seller/listing/my"}
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
								<Tx label={"Go to my listings (button)"} />
							</LinkTo>
						}
						ui={{
							tone: "brand",
							theme: "light",
							inner: "4xl",
						}}
						className="text-center"
					/>
				</Container>
			) : transactionListingCount.isFilterEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No listings for current filter (title)")}
						textMessage={translator.text("No listings for current filter (message)")}
						ui={{
							tone: "brand",
							theme: "light",
							inner: "4xl",
						}}
						className="text-center"
					/>
				</Container>
			) : (
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					{data.map((transactionListingId) => (
						<TransactionListingItemSuspense
							key={transactionListingId}
							data-id={transactionListingId}
							transactionListingId={transactionListingId}
						/>
					))}
				</Container>
			)}
		</Container>
	);
};
