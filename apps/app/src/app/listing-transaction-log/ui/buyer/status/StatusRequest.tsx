import { useParams } from "@tanstack/react-router";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionStatusIcon } from "~/app/listing-transaction/ui/TransactionStatusIcon";
import { TransactionStatusInline } from "~/app/listing-transaction/ui/TransactionStatusInline";

export namespace StatusRequest {
	export interface Props extends Container.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = ({
	listingTransactionLog,
	tweak,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Container
			tweak={[
				tweak,
				{
					slot: {
						root: {
							class: [
								"inline-flex",
								"flex-col",
								"gap-2",
								match(listingTransactionLog.side)
									.with("buyer", () => "items-end")
									.with("seller", () => "items-start")
									.with("transaction", "system", "unknown", () => "items-center")
									.exhaustive(),
							],
						},
					},
				},
			]}
			{...props}
		>
			<Typo
				label={toTimeDiff({
					locale,
					time: listingTransactionLog.createdAt,
				})}
				size={"md"}
				display={"block"}
				font={"bold"}
				tweak={{
					slot: {
						root: {
							class: [
								"text-center",
								"w-full",
							],
						},
					},
				}}
			/>

			<Badge
				round={"xl"}
				tweak={{
					slot: {
						root: {
							class: [
								"h-fit",
								"p-2",
								"max-w-2/3",
							],
						},
					},
				}}
				tone={"primary"}
			>
				<TransactionStatusIcon
					size={"sm"}
					transactionStatus={listingTransactionLog.status}
				/>

				<TransactionStatusInline
					side={"buyer"}
					transactionStatus={listingTransactionLog.status}
					size={"lg"}
				/>
			</Badge>
		</Container>
	);
};
