import { useParams } from "@tanstack/react-router";
import { Badge, type BadgeCls } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { Cls } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import type { tListingTransactionLog, tUserSide } from "@zbav-se.me/sdk/api/session";
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
								match(side)
									.with("buyer", () => "items-end")
									.with("seller", () => "items-start")
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
				tone={match<tUserSide, Cls.VariantOf<BadgeCls, "tone">>(side)
					.with("buyer", () => "primary")
					.with("seller", () => "link")
					.exhaustive()}
			>
				<TransactionStatusIcon
					size={"sm"}
					transactionStatus={listingTransactionLog.status}
				/>

				<TransactionStatusInline
					side={side}
					transactionStatus={listingTransactionLog.status}
					size={"lg"}
				/>
			</Badge>
		</Container>
	);
};
