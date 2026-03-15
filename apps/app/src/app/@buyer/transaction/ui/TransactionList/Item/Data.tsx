import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace Data {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, transactionId, ...props }) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const hero = useUpload(transaction.gallery.items);

	return (
		<LinkTo
			data-action={"open transaction detail"}
			to="/$locale/buyer/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId,
			}}
		>
			<ListItem
				data-ui={"TransactionItem[Item]"}
				hero={hero}
				title={
					<Tx
						label={transaction.title}
						ui={{
							font: "bold",
							display: "block",
							width: "full",
							truncate: true,
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
					<Tx
						label={transaction.location.address}
						ui={{
							text: "sm",
							opacity: "6",
							display: "block",
							width: "full",
							truncate: true,
						}}
						className={[
							"block",
							"w-full",
							"max-w-full",
							"min-w-0",
						]}
					/>
				}
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
