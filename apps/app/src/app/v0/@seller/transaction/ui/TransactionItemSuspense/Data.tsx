import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	transactionId,
	listingId,
	ui,
	className,
	...props
}) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	return (
		<LinkTo
			to="/$locale/seller/message/$listingId/$transactionId"
			params={{
				locale,
				listingId,
				transactionId,
			}}
		>
			<Container
				ui={{
					tone: "neutral",
					theme: "light",
					background: "default",
					border: true,
					shadow: true,
					position: "relative",
					round: "default",
					...ui,
				}}
				className={[
					"h-48 md:h-92",
					className,
				]}
				{...props}
			>
				{match(transaction.status)
					.with("rejected", "expired", "success", "closed", () => {
						return (
							<Container
								data-ui="TransactionItem-[Overlay]"
								ui={{
									tone: "neutral",
									theme: "light",
									background: "default",
									opacity: "8",
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

				<Container
					ui={{
						tone: "secondary",
						theme: "light",
						color: "lead",
						flow: "vertical",
						background: "default",
						border: true,
						shadow: true,
						inner: "default",
						round: "default",
						snapTo: "bottom",
					}}
					className={"text-center"}
				>
					<Tx
						label={transaction.title}
						ui={{
							font: "bold",
						}}
					/>
				</Container>
			</Container>
		</LinkTo>
	);
};
