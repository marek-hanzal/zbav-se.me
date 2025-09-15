import {
	Action,
	ArrowLeftIcon,
	Snapper,
	SnapperContent,
	SnapperItem,
	SnapperNav,
	Tour,
	TourButton,
	useSelection,
} from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { type FC, useCallback, useId, useMemo, useState } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { CategoryGroup } from "~/app/listing/ui/CreateListing/Category/CategoryGroup";
import type { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import type { TitleCls } from "~/app/ui/title/TitleCls";
import { PhotosWrapper } from "./CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "./CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "./CreateListing/Submit/SubmitWrapper";

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
	const photosId = useId();
	const tagsId = useId();
	const priceId = useId();
	const submitId = useId();

	const [photos, setPhotos] = useState<PhotoSlot.Value[]>(
		Array.from(
			{
				length: photoCountLimit,
			},
			() => null,
		),
	);
	const categoryGroupSelection = useSelection<CategoryGroupSchema.Type>({
		mode: "multi",
	});

	const [isTourOpen, setIsTourOpen] = useState(false);

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

	const handleTourClose = useCallback(() => {
		setIsTourOpen(false);
	}, []);

	return (
		<>
			<TourButton
				isOpen={isTourOpen}
				open={() => setIsTourOpen(true)}
			/>

			<Tour
				isOpen={isTourOpen}
				onClose={handleTourClose}
				placement={"top"}
				renderPrevButton={({ prev, disabled }) => (
					<Action
						iconEnabled={ArrowLeftIcon}
						onClick={prev}
						disabled={disabled}
					/>
				)}
				steps={[
					{
						selector: undefined,
						title: translator.text("Listing - Intro (tour)"),
						description: translator.text(
							"Listing - Intro (description)",
						),
					},
					{
						selector: `#${photosId}`,
						title: translator.text("Listing - Photos (tour)"),
						description: translator.text(
							"Listing - Photos (description)",
						),
					},
					{
						selector: `#${tagsId}`,
						title: translator.text("Listing - Tags (tour)"),
						description: translator.text(
							"Listing - Tags (description)",
						),
					},
					{
						selector: `#${priceId}`,
						title: translator.text("Listing - Price (tour)"),
						description: translator.text(
							"Listing - Price (description)",
						),
					},
					{
						selector: `#${submitId}`,
						title: translator.text("Listing - Submit (tour)"),
						description: translator.text(
							"Listing - Submit (description)",
						),
					},
				]}
			/>

			<Snapper orientation="horizontal">
				<SnapperNav
					pages={[
						{
							id: photosId,
							icon: hasPhotos ? CheckIcon : PhotoIcon,
							iconProps: () => ({
								tone: hasPhotos ? "primary" : "secondary",
							}),
						},
						{
							id: tagsId,
							icon: TagIcon,
						},
						{
							id: priceId,
							icon: PriceIcon,
						},
						{
							id: submitId,
							icon: SendPackageIcon,
						},
					]}
					iconProps={() => ({
						tone: "secondary",
						size: "md",
					})}
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
						<PriceWrapper subtitleVariant={subtitleVariant} />
					</SnapperItem>

					<SnapperItem>
						<CategoryGroup selection={categoryGroupSelection} />
					</SnapperItem>

					<SnapperItem>
						All categories, filter idIn of category group
					</SnapperItem>

					<SnapperItem>
						<SubmitWrapper canSubmit={canSubmit} />
					</SnapperItem>
				</SnapperContent>
			</Snapper>
		</>
	);
};
