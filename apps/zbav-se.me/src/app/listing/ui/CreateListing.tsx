import type { Cls } from "@use-pico/cls";
import { type FC, useCallback, useMemo, useState } from "react";
import type { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperContent } from "~/app/ui/snapper/SnapperContent";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
import { SnapperNav } from "~/app/ui/snapper/SnapperNav";
import type { TitleCls } from "~/app/ui/title/TitleCls";
import { PhotosWrapper } from "./CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "./CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "./CreateListing/Submit/SubmitWrapper";
import { TagsWrapper } from "./CreateListing/Tags/TagsWrapper";

const subtitleVariant: Cls.VariantsOf<TitleCls> = {
	tone: "secondary",
	size: "lg",
};

export namespace CreateListing {
	export interface Props {
		photoCountLimit: number;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ photoCountLimit }) => {
	const [photos, setPhotos] = useState<PhotoSlot.Value[]>(
		Array.from(
			{
				length: photoCountLimit,
			},
			() => null,
		),
	);

	const hasPhotos = useMemo(() => {
		return photos.some((p) => p !== null);
	}, [
		photos,
	]);

	const canSubmit = useMemo(() => {
		if (!hasPhotos) {
			return false;
		}

		return true;
	}, [
		hasPhotos,
	]);

	const onChangePhotos: PhotoSlot.OnChangeFn = useCallback(
		(file, slot) => {
			setPhotos((prev) => {
				const next = [
					...prev,
				];
				next[slot] = file;

				const compact: PhotoSlot.Value[] = next.filter(
					(f): f is File => f !== null,
				);

				while (compact.length < photoCountLimit) {
					compact.push(null);
				}

				return compact;
			});
		},
		[
			photoCountLimit,
		],
	);

	return (
		<Snapper orientation="vertical">
			<SnapperNav
				pages={[
					{
						id: "photos",
						icon: hasPhotos ? CheckIcon : PhotoIcon,
						iconProps: hasPhotos
							? {
									tone: "primary",
								}
							: undefined,
					},
					{
						id: "tags",
						icon: TagIcon,
					},
					{
						id: "price",
						icon: PriceIcon,
					},
					{
						id: "submit",
						icon: SendPackageIcon,
					},
				]}
			/>

			<SnapperContent>
				<SnapperItem>
					<PhotosWrapper
						count={photoCountLimit}
						value={photos}
						onChange={onChangePhotos}
					/>
				</SnapperItem>

				<SnapperItem>
					<TagsWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<PriceWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<SubmitWrapper canSubmit={canSubmit} />
				</SnapperItem>
			</SnapperContent>
		</Snapper>
	);
};
