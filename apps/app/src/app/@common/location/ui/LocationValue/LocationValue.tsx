import { LabelValue } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace LocationValue {
	export interface Props extends LabelValue.PropsEx {
		locationId: string | undefined | null;
	}
}

/**
 * Renders a read-only location value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
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
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				locationId={locationId}
				{...props}
			/>
		</Suspense>
	);
};
