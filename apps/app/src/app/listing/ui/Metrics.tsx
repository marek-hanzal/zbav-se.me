import { type Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user/listing";
import type { FC } from "react";
import { ScoreContainer } from "~/app/listing/ui/ScoreContainer";

export namespace Metrics {
	export interface Props extends Container.Props {
		listingId: string;
	}
}

export const Metrics: FC<Metrics.Props> = ({ listingId, ...props }) => {
	return (
		<withListingMetricsFetchQuery.Suspense
			data={listingId}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<ScoreContainer
						data-ui={"ListingDetail-[ScoreContainer]"}
						listingMetrics={data}
						{...props}
					/>
				);
			}}
		</withListingMetricsFetchQuery.Suspense>
	);
};
