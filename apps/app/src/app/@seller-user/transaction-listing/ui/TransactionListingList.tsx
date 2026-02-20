import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionListingCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/transaction-listing";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { TransactionListingItem } from "~/app/@seller-user/transaction-listing/ui/TransactionListingItem";

export namespace TransactionListingList {
	export interface Props extends Container.Props {
		query: tTransactionListingQuery;
	}
}

export const TransactionListingList: FC<TransactionListingList.Props> = ({
	query,
	ui,
	...props
}) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<withTransactionListingCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
				options={{
					refetchInterval: 5_000,
				}}
			>
				{({ data }) => {
					if (data.length === 0) {
						return (
							<Container
								ui={{
									layout: "vertical-centered",
									height: "full",
								}}
							>
								<Status
									icon={MessageIcon}
									textTitle={"No listings with transactions (title)"}
									textMessage={"No listings with transactions (message)"}
									action={
										<LinkTo
											icon={ChevronRightIcon}
											iconPosition={"right"}
											to={"/$locale/flow/seller/listing/my"}
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
						);
					}

					return (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.map((item) => (
								<TransactionListingItem
									key={item.listingId}
									data-id={item.listingId}
									transactionListingItem={item}
								/>
							))}
						</Container>
					);
				}}
			</withTransactionListingCollectionQuery.Suspense>
		</Container>
	);
};
