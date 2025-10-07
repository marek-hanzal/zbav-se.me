import {
	Action,
	ArrowLeftIcon,
	CheckIcon,
	Container,
	SnapperNav,
	Tour,
	TourButton,
} from "@use-pico/client";
import { translator } from "@use-pico/common";
import { type FC, useCallback, useId, useRef, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Category } from "~/app/listing/ui/CreateListing/Category/Category";
import { CategoryGroup } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroup";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
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
	const hasCategoryGroup = useCreateListingStore(
		(store) => store.hasCategoryGroup,
	);
	const hasCategory = useCreateListingStore((store) => store.hasCategory);
	const hasPhotos = useCreateListingStore((store) => store.hasPhotos);

	const [isTourOpen, setIsTourOpen] = useState(false);

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
							id: categoryGroupId,
							icon: hasCategoryGroup
								? CheckIcon
								: CategoryGroupIcon,
							iconProps: () => ({
								tone: hasCategoryGroup
									? "primary"
									: "secondary",
							}),
						},
						{
							id: categoryId,
							icon: hasCategory ? CheckIcon : CategoryIcon,
							iconProps: () => ({
								tone: hasCategory ? "primary" : "secondary",
							}),
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

					<CategoryGroup />

					<Category />

					<PriceWrapper />

					<SubmitWrapper />
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
