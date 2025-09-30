import {
	Action,
	ArrowLeftIcon,
	CheckIcon,
	Container,
	SnapperNav,
	TagIcon,
	Tour,
	TourButton,
	useSelection,
} from "@use-pico/client";
import { translator } from "@use-pico/common";
import { type FC, useCallback, useId, useMemo, useRef, useState } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { CategoryGroup } from "~/app/listing/ui/CreateListing/Category/CategoryGroup";
import type { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace CreateListing {
	export interface Props {
		photoCountLimit: number;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ photoCountLimit }) => {
	const photosId = useId();
	const categoryGroupId = useId();
	const categoryId = useId();
	const priceId = useId();
	const submitId = useId();

	const [photos, setPhotos] = useState<PhotoSlot.Value[]>(
		Array.from(
			{
				length: photoCountLimit,
			},
			() => undefined,
		),
	);
	const categoryGroupSelection = useSelection<CategoryGroupSchema.Type>({
		mode: "multi",
	});
	const categorySelection = useSelection<CategorySchema.Type>({
		mode: "multi",
	});

	const [isTourOpen, setIsTourOpen] = useState(false);

	const hasPhotos = useMemo(() => {
		return photos.some((p) => p !== null);
	}, [
		photos,
	]);

	const hasCategoryGroup = categoryGroupSelection.hasAny;
	const hasCategory = categorySelection.hasAny;

	const canSubmit = useMemo(() => {
		if (!hasPhotos) {
			return false;
		}

		if (!hasCategoryGroup) {
			return false;
		}

		if (!hasCategory) {
			return false;
		}

		return true;
	}, [
		hasPhotos,
		hasCategoryGroup,
		hasCategory,
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
					compact.push(undefined);
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

	const snapperRef = useRef<HTMLDivElement>(null);

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
						selector: `#${categoryGroupId}`,
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

			<Container
				layout="horizontal"
				position={"relative"}
			>
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
							id: priceId,
							icon: PriceIcon,
						},
						{
							id: categoryGroupId,
							icon: hasCategoryGroup ? CheckIcon : TagIcon,
							iconProps: () => ({
								tone: hasCategoryGroup
									? "primary"
									: "secondary",
							}),
						},
						{
							id: categoryId,
							icon: hasCategory ? CheckIcon : "icon-[typcn--tag]",
							iconProps: () => ({
								tone: hasCategory ? "primary" : "secondary",
							}),
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
					containerRef={snapperRef}
					orientation={"horizontal"}
				/>

				<Container
					ref={snapperRef}
					layout={"horizontal-full"}
					snap={"horizontal-start"}
					gap={"md"}
					round={"xl"}
				>
					<PhotosWrapper
						count={photoCountLimit}
						value={photos}
						onChange={onChangePhotos}
					/>

					<PriceWrapper />

					<CategoryGroup selection={categoryGroupSelection} />
				</Container>

				{/* <SnapperItem>
						<PriceWrapper subtitleVariant={subtitleVariant} />
					</SnapperItem>

					<SnapperItem>
						<CategoryGroup selection={categoryGroupSelection} />
					</SnapperItem>

					<SnapperItem>
						<Category
							categoryGroupSelection={categoryGroupSelection}
							categorySelection={categorySelection}
						/>
					</SnapperItem>

					<SnapperItem>
						<SubmitWrapper
							canSubmit={canSubmit}
							categorySelection={categorySelection}
						/>
					</SnapperItem> */}
			</Container>
		</>
	);
};
