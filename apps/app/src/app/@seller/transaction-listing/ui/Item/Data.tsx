import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { match } from "ts-pattern";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { Preview } from "./Preview";
import { StatusIcon } from "./StatusIcon";

export namespace Data {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, transactionId, ui, className, ...props }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	return (
		<LinkTo
			to="/$locale/seller/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId,
			}}
		>
			<ListItem
				data-ui={"TransactionItem[Item]"}
				hero={<StatusIcon status={transaction.status} />}
				title={
					<Typo
						label={match(transaction.status)
							.with("pending", () =>
								translator.text("Transaction status pending (label)"),
							)
							.with("open", () => translator.text("Transaction status open (label)"))
							.with("resolved", () =>
								translator.text("Transaction status resolved (label)"),
							)
							.with("dispute", () =>
								translator.text("Transaction status dispute (label)"),
							)
							.with("rejected", () =>
								translator.text("Transaction status rejected (label)"),
							)
							.with("sold", () => translator.text("Transaction status sold (label)"))
							.with("expired", () =>
								translator.text("Transaction status expired (label)"),
							)
							.with("success", () =>
								translator.text("Transaction status success (label)"),
							)
							.with("closed", () =>
								translator.text("Transaction status closed (label)"),
							)
							.exhaustive()}
						ui={{
							font: "bold",
						}}
						className={[
							"block",
							"w-full",
							"max-w-full",
							"min-w-0",
						]}
					/>
				}
				bottom={
					<Container
						ui={{
							flow: "horizontal",
							justify: "space-between",
							width: "full",
							gap: "default",
							items: "center",
						}}
					>
						<Container className={"min-w-0 flex-1"}>
							<Preview transactionId={transaction.id} />
						</Container>

						<Typo
							label={toTimeDiff({
								locale,
								time: transaction.updatedAt,
							})}
							ui={{
								text: "xs",
								opacity: "7",
							}}
						/>
					</Container>
				}
				ui={ui}
				className={className}
				{...props}
			>
				{match(transaction.status)
					.with("rejected", "sold", "expired", "success", "closed", () => {
						return (
							<Container
								data-ui="TransactionItem-[Overlay]"
								ui={{
									tone: "neutral",
									theme: "light",
									background: "default",
									opacity: "8",
									round: "default",
								}}
								className={[
									"absolute",
									"inset-0",
								]}
							/>
						);
					})
					.with("open", "pending", "resolved", "dispute", () => {
						return null;
					})
					.exhaustive()}
			</ListItem>
		</LinkTo>
	);
};
