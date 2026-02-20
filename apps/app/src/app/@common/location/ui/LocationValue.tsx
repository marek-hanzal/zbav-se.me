import { LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace LocationValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		locationId: string | undefined | null;
	}
}

export const LocationValue: FC<LocationValue.Props> = ({ locationId, ...props }) => {
	if (!locationId) {
		return (
			<LabelValue
				data-ui={"LocationValue[LabelValue.empty]"}
				{...props}
				textValue={null}
			/>
		);
	}

	return (
		<withLocationFetchQuery.Suspense
			data={{
				where: {
					id: locationId,
				},
			}}
			fallback={
				<LabelValue
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
					<LabelValue
						{...props}
						textValue={data.address}
					/>
				);
			}}
		</withLocationFetchQuery.Suspense>
	);
};
