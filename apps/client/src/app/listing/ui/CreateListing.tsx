import { Action, ArrowLeftIcon, Container, Tour } from "@use-pico/client";
import { translator } from "@use-pico/common";
import { type FC, useCallback, useId, useRef, useState } from "react";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionWrapper";
import { LocationWrapper } from "~/app/listing/ui/CreateListing/Location/LocationWrapper";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";

export const CreateListing: FC = () => {
	const photosId = useId();
	const categoryGroupId = useId();
	const categoryId = useId();
	const priceId = useId();
	const conditionId = useId();
	const submitId = useId();
	const locationId = useId();

	const [isTourOpen, setIsTourOpen] = useState(false);

	const handleTourClose = useCallback(() => {
		setIsTourOpen(false);
	}, []);

	const snapperRef = useRef<HTMLDivElement>(null);

	return (
		<>
			{/* <TourButton
				isOpen={isTourOpen}
				open={() => setIsTourOpen(true)}
			/> */}

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
				layout="vertical"
				position={"relative"}
			>
				{/* <SnapperPages
					snapperRef={snapperRef}
					photosId={photosId}
					categoryGroupId={categoryGroupId}
					categoryId={categoryId}
					conditionId={conditionId}
					priceId={priceId}
					locationId={locationId}
					submitId={submitId}
				/> */}

				<Container
					ref={snapperRef}
					layout={"vertical-full"}
					snap={"vertical-start"}
					gap={"md"}
				>
					<PhotosWrapper />

					<CategoryGroupWrapper />

					<CategoryWrapper />

					<ConditionWrapper />

					<PriceWrapper />

					<LocationWrapper />

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
