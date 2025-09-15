import {
	Snapper,
	SnapperContent,
	SnapperItem,
	SnapperNav,
} from "@use-pico/client";
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
		<div className="flex flex-col h-full">
			<Snapper
				orientation="vertical"
				tweak={({ what }) => ({
					slot: what.slot({
						root: what.css([
							"flex-1",
						]),
					}),
				})}
			>
				<SnapperNav
					pages={pages}
					iconProps={({ index }) => ({
						size: "xs",
						tone:
							index !== undefined && value[index]
								? "primary"
								: "secondary",
					})}
				/>

				<SnapperContent>
					{pages.map((_, slot) => {
						const disabled = slot > 0 && value[slot - 1] === null;

						return (
							<SnapperItem key={`photo-${slot + 1}`}>
								<PhotoSlot
									slot={slot}
									disabled={disabled}
									value={value[slot] ?? null}
									onChange={onChange}
								/>
							</SnapperItem>
						);
					})}
				</SnapperContent>
			</Snapper>
		</div>
	);
};
