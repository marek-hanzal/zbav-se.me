import { CopyIconAction } from "~/clipboard/ui/CopyIconAction";
import { ofGoogleMapFn } from "~/coordinate/fn/ofGoogleMapFn";
import { ofLatLonTextFn } from "~/coordinate/fn/ofLatLonTextFn";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { useLocale } from "~/locale/hook/useLocale";
import { withLocationQuery } from "~/session-location/query/withLocationQuery";
import { useTranslator } from "~/translation/hook/useTranslator";
import { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
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

export const Location = withFallbackFn(
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
					textLabel={translator.textFn("Personal - location")}
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
					textLabel={translator.textFn("Personal - map")}
					textValue={
						<a
							href={ofGoogleMapFn({
								latLon: location,
							})}
							target={"_blank"}
							{...uiLinkToFn({})}
						>
							{ofLatLonTextFn({
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
							text={ofLatLonTextFn({
								mode: "map",
								latLon: location,
							})}
						/>
					}
				/>

				<Typo
					label={toTimeDiffFn({
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
