import { type FC, useRef, useState } from "react";
import { match } from "ts-pattern";
import { HeroImage } from "~/application-ui/ui/img.exports";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import { AckMessage } from "~/seller-transaction/ui/AckMessage";
import { InterestMessage } from "~/seller-transaction/ui/InterestMessage";
import { ListingSheet } from "~/seller-transaction/ui/ListingSheet/index";
import { TransactionMenu } from "~/seller-transaction/ui/TransactionMenu";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";
import { TransactionChat } from "~/user-transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { TransactionEntryList } from "~/user-transaction-entry/ui/TransactionEntryList/index";

export namespace Transaction {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
		refresh: number;
	}
}

export const Transaction: FC<Transaction.Props> = ({
	_suspense,
	transactionId,
	refresh,
	...props
}) => {
	const translator = useTranslator();
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId, {
		refetchInterval: refresh,
	});
	const [hero] = transaction.withImageUrl;
	const [detail, setDetailFn] = useState(false);

	return (
		<Container
			data-ui={"Transaction"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-gap="xs"
			{...props}
		>
			<Container
				ref={containerRef}
				data-ui-layout="vertical-header-content"
				data-ui-height="full"
				data-ui-scroll="vertical"
				className={[
					"pb-[50%]",
				]}
			>
				<Container data-ui-height="content">
					<HeroImage
						src={hero}
						alt={`Hero image for transaction ${transaction.id}`}
						className={"h-42"}
						onClick={() => setDetailFn((value) => !value)}
					/>

					<Container data-ui-inner={"default"}>
						<Group>
							<LabelValue
								textLabel={translator.textFn("Listing price (label)")}
								textValue={
									<ListingPrice price={transaction as ListingPriceSchema.Type} />
								}
							/>

							<LabelValue
								textLabel={translator.textFn("Listing location (label)")}
								textValue={transaction.location.address}
								textValueProps={{
									"data-ui-truncate": false,
									"data-ui-wrap": "wrap",
								}}
							/>
						</Group>
					</Container>
				</Container>

				<TransactionEntryList
					_suspense={_suspense}
					side={"seller"}
					containerRef={containerRef}
					transactionId={transaction.id}
					refresh={refresh}
					data-ui-inner="default"
				/>
			</Container>

			<ListingSheet
				_suspense={_suspense}
				listingId={transaction.listingId}
				state={{
					value: detail,
					setFn: setDetailFn,
				}}
			/>

			{match(transaction.status)
				.with("interest", () => {
					return (
						<Container
							data-ui-flow="vertical"
							data-ui-inner="default"
							data-ui-gap="default"
						>
							<InterestMessage
								closeFn={() => {}}
								transaction={transaction}
							/>
						</Container>
					);
				})
				.with("success", "closed", "rejected", () => {
					return (
						<Container
							data-ui-flow="vertical"
							data-ui-inner="default"
							data-ui-gap={"default"}
						>
							<AckMessage
								closeFn={() => {}}
								transaction={transaction}
							/>
						</Container>
					);
				})
				.otherwise(() => {
					return (
						<TransactionChat
							transaction={transaction}
							left={
								<TransactionMenuButton>
									{(closeFn) => (
										<TransactionMenu
											closeFn={closeFn}
											transaction={transaction}
										/>
									)}
								</TransactionMenuButton>
							}
							text={{
								open: translator.textFn(
									"Transaction - send a message (placeholder)",
								),
								dispute: translator.textFn(
									"Transaction - dispute - send a message (placeholder)",
								),
								pending: translator.textFn(
									"Transaction not accepted - seller (message)",
								),
								resolved: translator.textFn(
									"Chat - transaction resolved - seller cannot write (message)",
								),
								closed: translator.textFn("Chat - transaction closed (message)"),
							}}
							data-ui-inner="default"
						/>
					);
				})}
		</Container>
	);
};
