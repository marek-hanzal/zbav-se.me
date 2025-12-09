import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton, uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { GalleryUpload } from "~/app/photo/ui/GalleryUpload";

export const Route = createFileRoute("/$locale/seller/listing/wizard/photos")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [uploadIds, setUploadIds] = useState<string[]>(state.uploadIds ?? []);

		// TODO Resolve photo limit from the user's tokens/plan/whatever
		const photoCountLimit = 10;

		const hasUploads = uploadIds.length > 0;
		const isUploading = withUploadMutation.useIsMutating();

		return (
			<TitleContainer
				data-ui={"ListingWizard-Photos"}
				textTitle={"Listing photos (title)"}
				left={
					<LinkTo
						{...uiButton({
							ui: {
								round: "full",
								square: "default",
								opacity: "subtle",
							},
							className: [],
						})}
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
							ui: {
								size: "md",
							},
						}}
						ui={{
							tone: "secondary",
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick: () => {
								navigate({
									to: "/$locale/seller",
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
					>
						<Button
							iconEnabled={ArrowRightIcon}
							ui={{
								tone: "secondary",
								theme: "dark",
							}}
							iconPosition={"right"}
							size={"xl"}
							disabled={!hasUploads || isUploading}
							label={"Next - category (button)"}
						/>
					</LinkTo>
				}
			>
				<GalleryUpload
					state={{
						value: uploadIds,
						set: setUploadIds,
					}}
					limit={photoCountLimit}
				/>
			</TitleContainer>
		);
	},
});
