import { Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { type FC, useMemo } from "react";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperContent } from "~/app/ui/snapper/SnapperContent";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
import { SnapperNav } from "~/app/ui/snapper/SnapperNav";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export namespace PhotosWrapper {
	export interface Props {
		count: number;
		subtitleVariant: Cls.VariantsOf<TitleCls>;
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
	subtitleVariant,
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
					iconProps: {
						size: "sm",
					},
				}),
			),
		[
			count,
		],
	);

	return (
		<div className="flex flex-col h-full">
			<Title
				icon={PhotoIcon}
				{...subtitleVariant}
			>
				<Tx label={"Photos (title)"} />
			</Title>

			<Snapper
				orientation="horizontal"
				tweak={({ what }) => ({
					slot: what.slot({
						root: what.css([
							"flex-1",
						]),
					}),
				})}
			>
				<SnapperNav pages={pages} />

				<SnapperContent
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"h-full",
							]),
						}),
					})}
				>
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
