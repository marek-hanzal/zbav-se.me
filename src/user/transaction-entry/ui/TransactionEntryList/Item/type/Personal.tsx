import type { Container as ContainerType } from "@/lib/client/container";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { withLocationFetchQuery } from "~/session/location/withLocationFetchQuery";
import type { TransactionEntryPersonal } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/PersonalSchema";
import { TypeContainer } from "./TypeContainer";

export namespace Personal {
	export interface Props extends ContainerType.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryPersonal.Type;
	}
}

export const Personal = withFallback(
	({ _suspense, transactionEntry, ...props }: Personal.Props) => {
		const locale = useLocale();
		const { data: location } = withLocationFetchQuery.useSuspenseQuery({
			where: {
				id: transactionEntry.payload.locationId,
			},
		});

		return (
			<TypeContainer
				data-ui={"Personal"}
				direction={transactionEntry.direction}
				ui={{
					flow: "vertical",
				}}
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
					data-ui-text="sm"
					data-ui-opacity="6"
				/>
			</TypeContainer>
		);
	},
	function PersonalFallback({
		transactionEntry,
	}: {
		transactionEntry: Pick<TransactionEntryPersonal.Type, "direction">;
	}) {
		return (
			<TypeContainer
				direction={transactionEntry.direction}
				ui={{
					flow: "vertical",
				}}
				className={"min-h-44"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
