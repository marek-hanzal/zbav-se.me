import type { SnapperNav } from "@use-pico/client";
import { type FC, useMemo } from "react";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { DotIcon } from "~/app/ui/icon/DotIcon";

export namespace PhotosWrapper {
	export interface Props {
		count: number;
		/**
		 * Array of photos - should be exactly count long.
		 *
		 * "null" represents an empty slot, but values should be ordered by "filled" first,
		 * this component is only wrapper rendering what's on input.
		 */
		value: PhotoSlot.Value[];
		/**
		 * Reports back changed slots.
		 */
		onChange: PhotoSlot.OnChangeFn;
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = ({
	count,
	value,
	onChange,
}) => {
	const pages: SnapperNav.Page[] = useMemo(
		() =>
			Array.from(
				{
					length: count,
				},
				(_, index) => ({
					id: `p-${index + 1}`,
					icon: DotIcon,
				}),
			),
		[
			count,
		],
	);

	return (
		<div
			data-ui="PhotosWrapper-root"
			className="grid h-full auto-rows-[100%]"
		>
			{pages.map((_, slot) => {
				const disabled = slot > 0 && value[slot - 1] === null;

				<PhotoSlot
					key={`photo-${slot + 1}`}
					slot={slot}
					disabled={disabled}
					value={value[slot] ?? null}
					onChange={onChange}
				/>;

				return <div key={`photo-${slot + 1}`}>jebka</div>;
			})}
		</div>
	);
};
