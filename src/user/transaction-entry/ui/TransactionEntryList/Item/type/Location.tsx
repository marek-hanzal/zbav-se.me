import type { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { withLocationFetchQuery } from "~/session/location/withLocationFetchQuery";
import type { TransactionEntryLocation } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/LocationSchema";
import { TypeContainer } from "./TypeContainer";

export namespace Location {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryLocation.Type;
	}
}

export const Location = withFallback(
	({ _suspense, transactionEntry, ...props }: Location.Props) => {
		const locale = useLocale();
		const { data: location } = withLocationFetchQuery.useSuspenseQuery({
			where: {
				id: transactionEntry.payload.locationId,
			},
		});

		return (
			<TypeContainer
				data-ui={"Location"}
				direction={transactionEntry.direction}
				ui={{
					flow: "vertical",
				}}
				{...props}
			>
				<Typo
					label={location.address}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>

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
			</TypeContainer>
		);
	},
	function LocationFallback({
		transactionEntry,
	}: {
		transactionEntry: Pick<TransactionEntryLocation.Type, "direction">;
	}) {
		return (
			<TypeContainer
				direction={transactionEntry.direction}
				ui={{
					flow: "vertical",
				}}
				className={"min-h-24"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
