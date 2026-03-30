import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { withLocationFetchQuery } from "~/session/location/withLocationFetchQuery";

export namespace LocationValue {
	export interface Props extends LabelValue.PropsEx, MarkSuspense.Props {
		locationId: string | undefined | null;
	}
}

/**
 * Renders a read-only location value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const LocationValue = withFallback(
	({ _suspense, locationId, ...props }: LocationValue.Props) => {
		if (!locationId) {
			return (
				<LabelValue
					data-ui={"LocationValue"}
					{...props}
					textValue={null}
				/>
			);
		}

		const { data } = withLocationFetchQuery.useSuspenseQuery({
			where: {
				id: locationId,
			},
		});

		return (
			<LabelValue
				data-ui={"LocationValue"}
				{...props}
				textValue={data.address}
			/>
		);
	},
	({ ...props }: Omit<LocationValue.Props, "_suspense">) => {
		return (
			<LabelValue
				data-ui={"LocationValue"}
				textValue={
					<SpinnerContainer
						type="icon"
						size="md"
					/>
				}
				{...props}
			/>
		);
	},
);
