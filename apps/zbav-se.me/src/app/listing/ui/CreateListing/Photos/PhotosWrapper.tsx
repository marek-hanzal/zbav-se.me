import { type FC, useMemo, useRef } from "react";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { Container } from "~/app/ui/container/Container";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { SnapperNav } from "~/app/ui/scroll/Snapper";

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
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container position={"relative"}>
			<SnapperNav
				containerRef={containerRef}
				pages={pages}
				orientation="vertical"
				iconProps={() => ({
					size: "xs",
				})}
			/>

			<Container
				ref={containerRef}
				orientation="vertical-full"
				snap="vertical-start"
				gap={"xs"}
			>
				{pages.map((_, slot) => {
					const disabled = slot > 0 && value[slot - 1] === null;

					return (
						<PhotoSlot
							key={`photo-${slot + 1}`}
							slot={slot}
							disabled={disabled}
							value={value[slot] ?? null}
							onChange={onChange}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
