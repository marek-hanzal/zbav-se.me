import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
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

		/**
		 * TODO Resolve photo limit from the user's tokens/plan/whatever
		 */
		const photoCountLimit = 10;

		const hasUploads = uploadIds.length > 0;
		const isUploading = withUploadMutation.useIsMutating();

		return (
			<TitleContainer
				ui="ListingWizard-Photos-root"
				textTitle={"Listing photos (title)"}
				left={
					<LinkTo
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
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
							size={"xl"}
							disabled={!hasUploads || isUploading}
							label={"Next - category (button)"}
							full
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
