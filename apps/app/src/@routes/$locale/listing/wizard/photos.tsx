import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	DotIcon,
	LinkTo,
	SnapperNav,
	Typo,
	useSnapperNav,
} from "@use-pico/client";
import { useId, useMemo, useRef } from "react";
import { z } from "zod";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { PhotoUpload } from "~/app/photo/PhotoUpload";

export const useSnapperPage = (): SnapperNav.Page[] => {
	const useCreateListingStore = useCreateListingContext();
	const photoCountLimit = useCreateListingStore(
		(store) => store.photoCountLimit,
	);
	const photos = useCreateListingStore((store) => store.photos);

	return useMemo(
		() =>
			Array.from(
				{
					length: photoCountLimit,
				},
				(_, index) =>
					({
						id: `p-${index + 1}`,
						icon: DotIcon,
						iconProps() {
							return photos[index]
								? {
										tone: "secondary",
									}
								: {
										tone: "primary",
									};
						},
					}) satisfies SnapperNav.Page,
			),
		[
			photoCountLimit,
			photos,
		],
	);
};

export const Route = createFileRoute("/$locale/listing/wizard/photos")({
	validateSearch: z.object({
		uploadIds: z.array(z.string()).default([]),
	}),
	component() {
		const { locale } = Route.useParams();
		const { uploadIds } = Route.useSearch();
		const navigate = Route.useNavigate();
		const pages = useSnapperPage();
		const snapperRef = useRef<HTMLDivElement>(null);
		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count: pages.length,
		});
		const uploadId = useId();
		/**
		 * TODO Resolve photo limit from the user's tokens/plan/whatever
		 */
		const photoCountLimit = 10;
		const hasUploads = uploadIds.length > 0;

		return (
			<ListingContainer
				ui="ListingWizard-Photos-root"
				textTitle={"Listing photos (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/dashboard"}
						params={{
							locale,
						}}
					/>
				}
				titleProps={{
					right: hasUploads ? (
						<>
							<Typo
								label={uploadIds.length}
								font={"bold"}
								display={"inline"}
							/>
							<Typo
								label={"/"}
								display={"inline"}
							/>
							<Typo
								label={photoCountLimit}
								display={"inline"}
							/>
						</>
					) : null,
				}}
				bottom={{
					next: (
						<LinkTo
							to={"/$locale/listing/wizard/category-group"}
							params={{
								locale,
							}}
							search={{
								uploadIds,
							}}
						>
							<Button
								tone={"primary"}
								theme={"dark"}
								iconEnabled={ArrowRightIcon}
							/>
						</LinkTo>
					),
				}}
			>
				<SnapperNav
					snapperNav={snapperNav}
					orientation={"horizontal"}
					iconProps={() => ({
						size: "sm",
					})}
					tweak={{
						slot: {
							root: {
								class: [
									"bottom-1",
									"transition-opacity",
									hasUploads ? "opacity-60" : "opacity-0",
								],
							},
						},
					}}
					subtle={false}
				/>

				<Container
					ref={snapperRef}
					layout="horizontal-full"
					overflow={"horizontal"}
					snap={"horizontal-start"}
					gap={"md"}
					round={"lg"}
				>
					{pages.map((_, slot) => {
						const disabled = slot > 0 && !uploadIds[slot - 1];

						return (
							<PhotoUpload
								key={`${uploadId}-${slot + 1}`}
								disabled={disabled}
								value={uploadIds[slot]}
								onChange={(uploadId) => {
									navigate({
										search({ uploadIds, ...search }) {
											const next: (string | undefined)[] =
												[
													...uploadIds,
												];
											next[slot] = uploadId;

											const compact: string[] =
												next.filter(
													(f): f is string => !!f,
												);

											return {
												...search,
												uploadIds: compact,
											};
										},
									});
								}}
							/>
						);
					})}
				</Container>
			</ListingContainer>
		);
	},
});
