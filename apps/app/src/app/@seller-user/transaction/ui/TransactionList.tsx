import { useLocale } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/transaction";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { TransactionItem } from "~/app/@seller-user/transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		query: tTransactionQuery;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ query, ui, ...props }) => {
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
			<withTransactionCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
				options={{
					refetchInterval: 5_000,
				}}
			>
				{({ data: { data } }) => {
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
									textTitle={"No transactions as seller (title)"}
									textMessage={"No transactions as seller (message)"}
									action={
										<LinkTo
											icon={ArrowRightIcon}
											iconPosition={"right"}
											to={"/$locale/ui/seller/listing/my"}
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
