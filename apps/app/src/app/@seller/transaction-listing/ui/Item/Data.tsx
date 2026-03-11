import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
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
				hero={
					<Container
						data-ui="TransactionItem-[Hero]"
						className={"aspect-square h-full shrink-0 overflow-hidden"}
						ui={{
							tone: "subtle",
							theme: "light",
							round: "md",
							height: "full",
							flow: "horizontal",
							items: "center",
							justify: "center",
							background: "default",
						}}
					>
						<Icon
							icon={match(transaction.status)
								.with("pending", () => "icon-[solar--clock-circle-linear]")
								.with("open", () => "icon-[solar--chat-round-linear]")
								.with(
									"resolved",
									"success",
									"sold",
									() => "icon-[solar--check-circle-linear]",
								)
								.with("dispute", () => "icon-[solar--danger-circle-linear]")
								.with(
									"rejected",
									"expired",
									"closed",
									() => "icon-[solar--lock-keyhole-linear]",
								)
								.exhaustive()}
							ui={{
								text: "2xl",
								color: "text",
								opacity: "7",
							}}
						/>
					</Container>
				}
				title={
					<Typo
						label={translator.text(transaction.status)}
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
