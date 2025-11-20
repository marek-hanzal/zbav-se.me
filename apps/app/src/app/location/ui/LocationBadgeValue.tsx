import { BadgeValue } from "@use-pico/client/ui/badge";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace LocationBadge {
	export interface Props extends Omit<BadgeValue.Props, "textValue"> {
		locationId: string;
	}
}

const LocationBadge: FC<LocationBadge.Props> = ({ locationId, ...props }) => {
	const locationQuery = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: locationId,
		},
	});
	return (
		<BadgeValue
			{...props}
			textValue={locationQuery.data.address}
		/>
	);
};

export namespace LocationBadgeValue {
	export interface Props extends BadgeValue.Props {
		locationId: string | undefined | null;
	}
}

export const LocationBadgeValue: FC<LocationBadgeValue.Props> = ({ locationId, ...props }) => {
	if (locationId) {
		return (
			<LocationBadge
				locationId={locationId}
				{...props}
			/>
		);
	}

	return <BadgeValue {...props} />;
};
