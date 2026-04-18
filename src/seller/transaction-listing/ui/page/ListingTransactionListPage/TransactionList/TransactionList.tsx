import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import { toStatusLabel } from "~/seller/transaction/ui/toStatusLabel";
import { Empty } from "./Empty";
import { ListGroup } from "./ListGroup";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		refetchInterval?: number;
	}
}

interface Group extends Partial<Omit<ListGroup.Props, "label" | "refetchInterval">> {
	label: string;
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	listingId,
	refetchInterval = 5_000,
	...props
}) => {
	const { data: hasTransaction } = withTransactionQuery.useCollectionQuery(
		{
			where: {
				listingId,
			},
			cursor: {
				page: 0,
				size: 1,
			},
		},
		{
			refetchInterval,
		},
	);
	/**
	 * This must be here, because we're using translations - so when put outside of the component,
	 * translations are... not being translated :).
	 */
	const groups = useMemo(
		() =>
			[
				{
					label: translator.text("Transaction - buyer-to-seller - seller (title)"),
					filter: {
						statusIn: [],
						activity: "unread",
					},
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.interest),
					filter: {
						statusIn: [
							TransactionStatusEnumSchema.enum.interest,
						],
						activity: "archived",
					},
					typoProps: {
						"data-ui-tone": "neutral",
						"data-ui-theme": "light",
					},
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.trade),
					filter: {
						statusIn: [
							TransactionStatusEnumSchema.enum.trade,
						],
						activity: "archived",
					},
					typoProps: {
						"data-ui-font": "normal",
					},
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.dispute),
					filter: {
						statusIn: [
							TransactionStatusEnumSchema.enum.dispute,
						],
						activity: "archived",
					},
					typoProps: {
						"data-ui-font": "normal",
					},
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.resolved),
					filter: {
						statusIn: [
							TransactionStatusEnumSchema.enum.resolved,
						],
						activity: "archived",
					},
					typoProps: {
						"data-ui-font": "normal",
					},
				},
				{
					label: translator.text("Messages closed listings section (title)"),
					filter: {
						statusIn: [
							TransactionStatusEnumSchema.enum.success,
							TransactionStatusEnumSchema.enum.rejected,
							TransactionStatusEnumSchema.enum.sold,
							TransactionStatusEnumSchema.enum.closed,
							TransactionStatusEnumSchema.enum.expired,
						],
						activity: "archived",
					},
					"data-ui-opacity": "7",
					typoProps: {
						"data-ui-tone": "neutral",
						"data-ui-theme": "light",
						"data-ui-opacity": "7",
						"data-ui-font": "normal",
					},
				},
			] satisfies Group[],
		[],
	);

	return (
		<Container
			data-ui={"TransactionList"}
			data-ui-scroll="vertical"
			data-ui-height="full"
			data-ui-layout="vertical-flex"
			data-ui-gap="2xl"
			{...props}
		>
			<EmptyState
				check={[
					{
						check() {
							return !hasTransaction.length;
						},
						render() {
							return <Empty />;
						},
					},
				]}
			>
				{groups.map(({ label, filter, ...props }) => {
					return (
						<ListGroup
							key={filter.statusIn.join(":")}
							_suspense={_suspense}
							label={label}
							filter={{
								...filter,
								listingId,
							}}
							refetchInterval={refetchInterval}
							{...props}
						/>
					);
				})}
			</EmptyState>
		</Container>
	);
};
