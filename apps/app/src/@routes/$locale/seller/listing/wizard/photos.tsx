import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	SnapperNav,
	useSnapperNav,
} from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";
import { useId, useRef, useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { PhotoUpload } from "~/app/photo/PhotoUpload";
import { withUploadMutation } from "~/app/upload/mutation/withUploadMutation";

export const Route = createFileRoute("/$locale/seller/listing/wizard/photos")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [uploadIds, setUploadIds] = useState<string[]>(
			state.uploadIds ?? [],
		);

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
		const hasUploads = uploadIds.length > 0;
		const isUploading = withUploadMutation.useIsMutating();

		return (
			<TitleContainer
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
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/category"}
						params={{
							locale,
						}}
						search={{
							...state,
							uploadIds,
						}}
						disabled={!hasUploads || isUploading}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							disabled={!hasUploads || isUploading}
							label={"Next - category (button)"}
							full
						/>
					</LinkTo>
				}
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
							const disabled = slot > 0 && !uploadIds[slot - 1];

							return (
								<PhotoUpload
									key={`${uploadId}-${slot + 1}`}
									disabled={disabled}
									value={uploadIds[slot]}
									onChange={(uploadId) => {
										setUploadIds((prev) => {
											const next: (string | undefined)[] =
												[
													...prev,
												];
											next[slot] = uploadId;

											const compact: string[] =
												next.filter(
													(f): f is string => !!f,
												);

											return compact;
										});
									}}
								/>
							);
						})}
					</Container>
				</div>
			</TitleContainer>
		);
	},
});
