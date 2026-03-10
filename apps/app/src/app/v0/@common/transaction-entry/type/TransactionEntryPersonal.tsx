import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionEntryPersonal {
	export type TransactionEntry = Extract<
		withTransactionEntryQuery.Entity,
		{
			kind: "personal";
		}
	>;

	export interface Props extends Container.Props {
		transactionEntry: TransactionEntry;
	}
}

export const TransactionEntryPersonal: FC<TransactionEntryPersonal.Props> = ({
	transactionEntry,
	...props
}) => {
	const locale = useLocale();
	const { data: location } = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: transactionEntry.payload.locationId,
		},
	});

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				flow: "vertical",
				inner: "default",
				round: "default",
				...match<typeof transactionEntry.direction, uiContainer.Ui>(transactionEntry.direction)
					.with("in", () => {
						return {
							tone: "link",
						};
					})
					.with("out", () => {
						return {
							tone: "primary",
						};
					})
					.with("system", () => {
						return {
							tone: "neutral",
						};
					})
					.exhaustive(),
			}}
			className={[
				"w-2/3",
				transactionEntry.direction === "in" ? [] : undefined,
				transactionEntry.direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				transactionEntry.direction === "system"
					? [
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "xs",
				}}
			>
				<Typo
					label={transactionEntry.payload.name}
					ui={{
						wrap: "wrap",
						font: "bold",
					}}
					className={"py-1"}
				/>

				<Typo
					label={transactionEntry.payload.phone}
					ui={{
						wrap: "wrap",
					}}
				/>

				<Typo
					label={transactionEntry.payload.email}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>

				<Typo
					label={location.address}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>
			</Container>

			<Typo
				label={toTimeDiff({
					locale,
					time: transactionEntry.createdAt,
					type: "relative",
				})}
				ui={{
					text: "sm",
					opacity: "6",
				}}
			/>
		</Container>
	);
};
