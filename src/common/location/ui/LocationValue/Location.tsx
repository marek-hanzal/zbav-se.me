import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";
import { withLocationFetchQuery } from "~/session/location/withLocationFetchQuery";

export namespace Location {
	export interface Props extends LabelValue.PropsEx {
		locationId: string;
	}
}

export const Location: FC<Location.Props> = ({ locationId, ...props }) => {
	const { data } = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: locationId,
		},
	});

	return (
		<LabelValue
			data-ui={"LocationValue"}
			wrapperProps={{
				"data-ui-tone": "neutral",
			}}
			{...props}
			textValue={data.address}
		/>
	);
};
