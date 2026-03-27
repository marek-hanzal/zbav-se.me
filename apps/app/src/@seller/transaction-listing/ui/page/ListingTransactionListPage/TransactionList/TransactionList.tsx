import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { translator } from "@use-pico/common/translator";
import { type FC, useMemo } from "react";
import { TransactionStatusEnumSchema } from "~/@common/user-transaction/enum/TransactionStatusEnumSchema";
import { toStatusLabel } from "~/@seller/transaction/~public/toStatusLabel";
import { withTransactionQuery } from "~/@seller/transaction/query/withTransactionQuery";
import { Empty } from "./Empty";
import { ListGroup } from "./ListGroup";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		refetchInterval?: number;
	}
}

interface Group extends Partial<Omit<ListGroup.Props, "filter" | "label" | "refetchInterval">> {
	label: string;
	statuses: TransactionStatusEnumSchema.Type[];
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	listingId,
	refetchInterval = 5_000,
	ui,
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
					label: toStatusLabel(TransactionStatusEnumSchema.enum.pending),
					statuses: [
						TransactionStatusEnumSchema.enum.pending,
					],
					typoUi: {
						tone: "neutral",
						theme: "light",
					},
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.open),
					statuses: [
						TransactionStatusEnumSchema.enum.open,
					],
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.dispute),
					statuses: [
						TransactionStatusEnumSchema.enum.dispute,
					],
				},
				{
					label: toStatusLabel(TransactionStatusEnumSchema.enum.resolved),
					statuses: [
						TransactionStatusEnumSchema.enum.resolved,
					],
				},
				{
					label: translator.text("Messages closed listings section (title)"),
					statuses: [
						TransactionStatusEnumSchema.enum.success,
						TransactionStatusEnumSchema.enum.rejected,
						TransactionStatusEnumSchema.enum.sold,
						TransactionStatusEnumSchema.enum.closed,
						TransactionStatusEnumSchema.enum.expired,
					],
					ui: {
						opacity: "7",
					},
					typoUi: {
						tone: "neutral",
						theme: "light",
						opacity: "7",
					},
				},
			] satisfies Group[],
		[],
	);

	return (
		<Container
			data-ui={"TransactionList"}
			ui={{
				scroll: "vertical",
				height: "full",
				layout: "vertical-flex",
				gap: "2xl",
				...ui,
			}}
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
				{groups.map(({ statuses, label, ...props }) => {
					return (
						<ListGroup
							key={statuses.join(":")}
							_suspense={_suspense}
							label={label}
							filter={{
								listingId,
								statusIn: statuses,
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
