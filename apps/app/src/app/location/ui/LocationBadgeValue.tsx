import type { MarkSuspense } from "@use-pico/client/type";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, Suspense } from "react";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace LocationBadge {
	export interface Props extends Omit<BadgeValue.Props, "textValue">, MarkSuspense.Props {
		locationId: string;
	}
}

const LocationBadge: FC<LocationBadge.Props> = ({ _suspense, locationId, ...props }) => {
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
	return (
		<Suspense
			fallback={
				<BadgeValue
					{...props}
					textValue={
						<SpinnerContainer
							type="icon"
							size="md"
							ui={{
								height: "content",
							}}
						/>
					}
				/>
			}
		>
			{locationId ? (
				<LocationBadge
					_suspense={"I know"}
					locationId={locationId}
					{...props}
				/>
			) : (
				<BadgeValue {...props} />
			)}
		</Suspense>
	);
};
