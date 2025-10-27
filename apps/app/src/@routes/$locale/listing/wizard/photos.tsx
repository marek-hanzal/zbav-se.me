import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	SnapperNav,
	Typo,
	useSnapperNav,
} from "@use-pico/client";
import { useId, useRef } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { PhotoUpload } from "~/app/photo/PhotoUpload";

export const Route = createFileRoute("/$locale/listing/wizard/photos")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		/**
		 * TODO Resolve photo limit from the user's tokens/plan/whatever
		 */
		const photoCountLimit = 10;

		const snapperRef = useRef<HTMLDivElement>(null);
		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count: photoCountLimit,
		});
		const uploadId = useId();
		const hasUploads = state.uploadIds.length > 0;

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
						tone={"secondary"}
					/>
				}
				titleProps={{
					right: hasUploads ? (
						<>
							<Typo
								label={state.uploadIds.length}
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
							to={"/$locale/listing/wizard/category"}
							params={{
								locale,
							}}
							search={state}
							disabled={!hasUploads}
						>
							<Button
								tone={"secondary"}
								theme={"dark"}
								iconEnabled={ArrowRightIcon}
								size={"lg"}
								disabled={!hasUploads}
							/>
						</LinkTo>
					),
				}}
			>
				<div className={"relative"}>
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
						{Array.from({
							length: photoCountLimit,
						}).map((_, slot) => {
							const disabled =
								slot > 0 && !state.uploadIds[slot - 1];

							return (
								<PhotoUpload
									key={`${uploadId}-${slot + 1}`}
									disabled={disabled}
									value={state.uploadIds[slot]}
									onChange={(uploadId) => {
										navigate({
											search({ uploadIds, ...search }) {
												const next: (
													| string
													| undefined
												)[] = [
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
				</div>
			</ListingContainer>
		);
	},
});
