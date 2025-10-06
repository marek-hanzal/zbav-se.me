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
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroup } from "~/app/listing/ui/CreateListing/Category/CategoryGroup";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export const CreateListing: FC = () => {
	const photosId = useId();
	const categoryGroupId = useId();
	const categoryId = useId();
	const priceId = useId();
	const submitId = useId();

	const useCreateListingStore = useCreateListingContext();
	const setCategoryGroup = useCreateListingStore(
		(store) => store.setCategoryGroup,
	);
	const setCategory = useCreateListingStore((store) => store.setCategory);

	const categoryGroupSelection = useSelection<CategoryGroupSchema.Type>({
		mode: "multi",
		onMulti: setCategoryGroup,
	});
	const categorySelection = useSelection<CategorySchema.Type>({
		mode: "multi",
		onMulti: setCategory,
	});
	const hasPhotos = useCreateListingStore((store) => store.hasPhotos);

	const [isTourOpen, setIsTourOpen] = useState(false);

	const canSubmit = useMemo(() => {
		if (!hasPhotos) {
			return false;
		}

		if (!categoryGroupSelection.hasAny) {
			return false;
		}

		if (!categorySelection.hasAny) {
			return false;
		}

		return true;
	}, [
		hasPhotos,
		categoryGroupSelection.hasAny,
		categorySelection.hasAny,
	]);

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
							icon: hasPhotos() ? CheckIcon : PhotoIcon,
							iconProps: () => ({
								tone: hasPhotos() ? "primary" : "secondary",
							}),
						},
						{
							id: priceId,
							icon: PriceIcon,
						},
						{
							id: categoryGroupId,
							icon: categoryGroupSelection.hasAny
								? CheckIcon
								: TagIcon,
							iconProps: () => ({
								tone: categoryGroupSelection.hasAny
									? "primary"
									: "secondary",
							}),
						},
						{
							id: categoryId,
							icon: categorySelection.hasAny
								? CheckIcon
								: "icon-[typcn--tag]",
							iconProps: () => ({
								tone: categorySelection.hasAny
									? "primary"
									: "secondary",
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
					<PhotosWrapper />

					<CategoryGroup selection={categoryGroupSelection} />

					{/* <Category categoryGroupSelection={categoryGroupSelection} categorySelection={caSe}/> */}

					<PriceWrapper />

					<SubmitWrapper canSubmit={canSubmit} />
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
						
					</SnapperItem> */}
			</Container>
		</>
	);
};
