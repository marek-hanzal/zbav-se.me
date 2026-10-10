import type { FC } from "react";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace LocationValue {
	export interface Props extends LabelValue.PropsEx {
		location: LocationSchema.Type | undefined | null;
	}
}

/**
 * Renders a read-only location value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const LocationValue: FC<LocationValue.Props> = ({ location, ...props }) => {
	if (!location) {
		return (
			<LabelValue
				data-ui={"LocationValue"}
				wrapperProps={{
					"data-ui-tone": "primary",
				}}
				textValue={null}
				{...props}
			/>
		);
	}

	return (
		<LabelValue
			data-ui={"LocationValue"}
			wrapperProps={{
				"data-ui-tone": "neutral",
			}}
			textValue={location.address}
			{...props}
		/>
	);
};
