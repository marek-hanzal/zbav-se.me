import { createFileRoute } from "@tanstack/react-router";
import { useSnapperNav } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { SnapperNav } from "@use-pico/client/ui/snapper-nav";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useId, useRef, useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { PhotoUpload } from "~/app/photo/PhotoUpload";

export const Route = createFileRoute("/$locale/seller/listing/wizard/photos")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [uploadIds, setUploadIds] = useState<string[]>(state.uploadIds ?? []);

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
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						iconProps={{
							size: "md",
						}}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/seller",
									params: {
										locale,
									},
								});
							},
						}}
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
						snap={"horizontal-start"}
						gap={"md"}
						round={"default"}
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
											const next: (string | undefined)[] = [
												...prev,
											];
											next[slot] = uploadId;

											const compact: string[] = next.filter(
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
