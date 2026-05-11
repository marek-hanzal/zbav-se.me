import { CopyIconAction } from "@/lib/client/clipboard/CopyIconAction";
import type { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue } from "@/lib/client/value";
import { ofGoogleMap, ofLatLonText } from "@/lib/common/location";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translation";
import { withLocationQuery } from "~/session/location/query/withLocationQuery";
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
		const { data: location } = withLocationQuery.useFetchQuery(
			transactionEntry.payload.locationId,
		);

		return (
			<TypeContainer
				data-ui={"Location"}
				direction={transactionEntry.direction}
				data-ui-flow="vertical"
				{...props}
			>
				<LabelValue
					textLabel={translator.text("Personal - location")}
					textValue={location.address}
					textLabelProps={{
						"data-ui-text": "default",
						"data-ui-font": "normal",
					}}
					textValueProps={{
						"data-ui-wrap": "wrap",
						"data-ui-text": "default",
						"data-ui-truncate": false,
					}}
					data-ui-background={undefined}
					action={<CopyIconAction text={location.address} />}
				/>
				<LabelValue
					textLabel={translator.text("Personal - map")}
					textValue={
						<a
							href={ofGoogleMap({
								latLon: location,
							})}
							target={"_blank"}
							{...uiLinkTo({})}
						>
							{ofLatLonText({
								mode: "text",
								latLon: location,
							})}
						</a>
					}
					textLabelProps={{
						"data-ui-text": "default",
						"data-ui-font": "normal",
					}}
					data-ui-background={undefined}
					action={
						<CopyIconAction
							text={ofLatLonText({
								mode: "map",
								latLon: location,
							})}
						/>
					}
				/>

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
	function LocationFallback({
		transactionEntry,
	}: {
		transactionEntry: Pick<TransactionEntryLocation.Type, "direction">;
	}) {
		return (
			<TypeContainer
				direction={transactionEntry.direction}
				data-ui-flow="vertical"
				className={"min-h-24"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
