import type { MarkSuspense } from "@use-pico/client/type";
import { LabelValue } from "@use-pico/client/ui/container";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace Data {
	export interface Props extends LabelValue.PropsEx, MarkSuspense.Props {
		locationId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, locationId, ...props }) => {
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
