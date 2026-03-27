import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import type { Container } from "@use-pico/client/ui/container";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { withLocationFetchQuery } from "~/session/location/withLocationFetchQuery";
import type { TransactionEntryLocation } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/LocationSchema";
import { TypeContainer } from "../TypeContainer";

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
