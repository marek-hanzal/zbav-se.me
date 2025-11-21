import { useParams } from "@tanstack/react-router";
import { Badge, type BadgeCls } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { Cls } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import type { tListingTransactionLog, tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionStatusInline } from "~/app/@buyer/listing-transaction/ui/TransactionStatusInline";
import { TransactionStatusIcon } from "~/app/listing-transaction/ui/TransactionStatusIcon";

export namespace StatusEvent {
	export interface Props extends Container.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusEvent: FC<StatusEvent.Props> = ({
	listingTransactionLog,
	tweak,
	children,
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
								"gap-1",
								match(listingTransactionLog.side)
									.with("buyer", () => "items-end")
									.with("seller", () => "items-start")
									.with("system", "transaction", "unknown", () => "items-center")
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
				theme={"light"}
				tone={"secondary"}
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
				round={"default"}
				tweak={{
					slot: {
						root: {
							class: [
								"h-fit",
								"p-2",
								"flex",
								"flex-col",
								"items-start",
								"max-w-5/6",
								"w-5/6",
							],
						},
					},
				}}
				tone={match<tListingTransactionStatus, Cls.VariantOf<BadgeCls, "tone">>(
					listingTransactionLog.status,
				)
					.with("request", () => "primary")
					.with("accepted", "success", () => "secondary")
					.with("rejected", () => "danger")
					.with("closed", "expired", () => "secondary")
					.exhaustive()}
			>
				<div className="flex items-center gap-1">
					<TransactionStatusIcon
						size={"sm"}
						transactionStatus={listingTransactionLog.status}
					/>

					<TransactionStatusInline
						transactionStatus={listingTransactionLog.status}
						size={"lg"}
					/>
				</div>

				{children}
			</Badge>
		</Container>
	);
};
