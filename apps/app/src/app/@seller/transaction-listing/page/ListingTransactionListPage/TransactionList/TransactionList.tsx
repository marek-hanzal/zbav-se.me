import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { translator } from "@use-pico/common/translator";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { type FC, useMemo } from "react";
import { toStatusLabel } from "~/app/@seller/transaction/~public/toStatusLabel";
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
	statuses: tTransactionStatusEnum[];
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
					label: toStatusLabel(tTransactionStatusEnum.pending),
					statuses: [
						tTransactionStatusEnum.pending,
					],
					typoUi: {
						tone: "brand",
						theme: "light",
					},
				},
				{
					label: toStatusLabel(tTransactionStatusEnum.open),
					statuses: [
						tTransactionStatusEnum.open,
					],
				},
				{
					label: toStatusLabel(tTransactionStatusEnum.dispute),
					statuses: [
						tTransactionStatusEnum.dispute,
					],
				},
				{
					label: toStatusLabel(tTransactionStatusEnum.resolved),
					statuses: [
						tTransactionStatusEnum.resolved,
					],
				},
				{
					label: translator.text("Messages closed listings section (title)"),
					statuses: [
						tTransactionStatusEnum.success,
						tTransactionStatusEnum.rejected,
						tTransactionStatusEnum.sold,
						tTransactionStatusEnum.closed,
						tTransactionStatusEnum.expired,
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
			ui={{
				scroll: "vertical",
				height: "full",
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
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "2xl",
					}}
				>
					{groups.map(({ statuses, label, ...props }) => {
						return (
							<ListGroup
								key={statuses.join(":")}
								_suspense={_suspense}
								label={label}
								filter={{
									listingId,
									...(statuses.length === 1
										? {
												status: statuses[0],
											}
										: {
												statusIn: statuses,
											}),
								}}
								refetchInterval={refetchInterval}
								{...props}
							/>
						);
					})}
				</Container>
			</EmptyState>
		</Container>
	);
};
