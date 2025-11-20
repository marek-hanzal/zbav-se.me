import { useParams } from "@tanstack/react-router";
import { Badge, type BadgeCls } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { Cls } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import type {
	tListingTransactionLog,
	tListingTransactionStatus,
	tUserSide,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionStatusIcon } from "~/app/listing-transaction/ui/TransactionStatusIcon";
import { TransactionStatusInline } from "~/app/listing-transaction/ui/TransactionStatusInline";

export namespace StatusEvent {
	export interface Props extends Container.Props {
		side: tUserSide;
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusEvent: FC<StatusEvent.Props> = ({
	side,
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
								match(side)
									.with("buyer", () => {
										return match(listingTransactionLog.side)
											.with("buyer", () => "items-end")
											.with("seller", () => "items-start")
											.with(
												"system",
												"transaction",
												"unknown",
												() => "items-center",
											)
											.exhaustive();
									})
									.with("seller", () => {
										return match(listingTransactionLog.side)
											.with("buyer", () => "items-start")
											.with("seller", () => "items-end")
											.with(
												"system",
												"transaction",
												"unknown",
												() => "items-center",
											)
											.exhaustive();
									})
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
				tone={match<tUserSide, Cls.VariantOf<BadgeCls, "tone">>(side)
					.with("buyer", () => {
						return match<tListingTransactionStatus, Cls.VariantOf<BadgeCls, "tone">>(
							listingTransactionLog.status,
						)
							.with("request", () => "primary")
							.with("accepted", "success", () => "secondary")
							.with("rejected", () => "danger")
							.with("closed", "expired", () => "secondary")
							.exhaustive();
					})
					.with("seller", () => {
						return match<tListingTransactionStatus, Cls.VariantOf<BadgeCls, "tone">>(
							listingTransactionLog.status,
						)
							.with("request", () => "secondary")
							.with("accepted", "success", () => "primary")
							.with("rejected", () => "danger")
							.with("closed", "expired", () => "secondary")
							.exhaustive();
					})
					.exhaustive()}
			>
				<div className="flex items-center gap-1">
					<TransactionStatusIcon
						size={"sm"}
						transactionStatus={listingTransactionLog.status}
					/>

					<TransactionStatusInline
						side={side}
						transactionStatus={listingTransactionLog.status}
						size={"lg"}
					/>
				</div>

				{children}
			</Badge>
		</Container>
	);
};
