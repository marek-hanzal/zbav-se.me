import { CopyIconAction } from "~/clipboard/ui/CopyIconAction";
import { ofGoogleMap } from "~/coordinate/fn/ofGoogleMap";
import { ofLatLonText } from "~/coordinate/fn/ofLatLonText";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { withLocationQuery } from "~/session-location/query/withLocationQuery";
import { useTranslator } from "~/translation/hook/useTranslator";
import { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import type { TransactionEntryLocation } from "~/user-transaction-entry/schema/TransactionEntryLocationSchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

export namespace Location {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryLocation.Type;
	}
}

export const Location = withFallback(
	({ _suspense, transactionEntry, ...props }: Location.Props) => {
		const translator = useTranslator();
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
