import { BadgeValue } from "@use-pico/client/ui/badge";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace LocationBadgeValue {
	export interface Props extends BadgeValue.Props {
		locationId: string | undefined | null;
	}
}

export const LocationBadgeValue: FC<LocationBadgeValue.Props> = ({ locationId, ...props }) => {
	if (!locationId) {
		return <BadgeValue {...props} />;
	}

	return (
		<withLocationFetchQuery.Suspense
			data={{
				where: {
					id: locationId,
				},
			}}
			fallback={
				<BadgeValue
					{...props}
					textValue={
						<SpinnerContainer
							type="icon"
							size="md"
						/>
					}
				/>
			}
		>
			{({ data }) => {
				return (
					<BadgeValue
						{...props}
						textValue={data.address}
					/>
				);
			}}
		</withLocationFetchQuery.Suspense>
	);
};
