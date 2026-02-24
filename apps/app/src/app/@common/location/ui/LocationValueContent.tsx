import type { MarkSuspense } from "@use-pico/client/type";
import { LabelValue } from "@use-pico/client/ui/container";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace LocationValueContent {
	export interface Props extends Omit<LabelValue.Props, "textValue">, MarkSuspense.Props {
		locationId: string;
	}
}

export const LocationValueContent: FC<LocationValueContent.Props> = ({
	_suspense,
	locationId,
	...props
}) => {
	const { data } = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: locationId,
		},
	});

	return (
		<LabelValue
			{...props}
			textValue={data.address}
		/>
	);
};
