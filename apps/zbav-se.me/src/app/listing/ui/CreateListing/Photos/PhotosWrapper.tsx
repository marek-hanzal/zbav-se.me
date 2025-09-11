import { Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
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
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = ({
	count,
	subtitleVariant,
}) => {
	const pages: SnapperNav.Page[] = Array.from(
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
					{pages.map((_, slot) => (
						<SnapperItem key={`photo-${slot + 1}`}>
							<PhotoSlot slot={slot} />
						</SnapperItem>
					))}
				</SnapperContent>
			</Snapper>
		</div>
	);
};
