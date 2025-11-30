import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import { withListingTransactionGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { GalleryUpload } from "./GalleryUpload";

export namespace GalleryUploadButton {
	export interface Props extends Button.Props {
		listingTransactionId: string;
	}
}

export const GalleryUploadButton: FC<GalleryUploadButton.Props> = ({
	listingTransactionId,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [uploadIds, setUploadIds] = useState<string[]>([]);
	const mutation = withListingTransactionGalleryCreateMutation.useMutation({
		async onPostMutation() {
			setIsOpen(false);
			setUploadIds([]);
		},
	});

	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				iconPosition={"right"}
				tone={"primary"}
				theme={"light"}
				label={"Upload photos (button)"}
				size={"xl"}
				menu
				onClick={() => setIsOpen((isOpen) => !isOpen)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					square={"md"}
				>
					<GalleryUpload
						state={{
							value: uploadIds,
							set: setUploadIds,
						}}
						limit={10}
					/>

					<div
						className={tvc([
							"flex",
							"flex-row",
							"gap-2",
							"items-center",
							"justify-center",
						])}
					>
						<ConfirmButton
							label={"Cancel (button)"}
							tone={"primary"}
							size={"xl"}
							full
							confirmProps={{
								tone: "danger",
								theme: "dark",
								onClick() {
									setIsOpen(false);
									setUploadIds([]);
								},
							}}
							disabled={mutation.isPending}
						/>

						<Button
							label={"Upload gallery (button)"}
							size={"xl"}
							full
							disabled={mutation.isPending || uploadIds.length === 0}
							loading={mutation.isPending}
							onClick={() => {
								mutation.mutate({
									listingTransactionId,
									uploadIds: uploadIds,
								});
							}}
						/>
					</div>
				</Container>
			</BottomSheet>
		</>
	);
};
