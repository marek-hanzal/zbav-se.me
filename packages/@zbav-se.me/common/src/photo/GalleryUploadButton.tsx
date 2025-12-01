import type { withMutation } from "@use-pico/client/mutation";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { useState } from "react";
import { GalleryUpload } from "./GalleryUpload";

export namespace GalleryUploadButton {
	export interface Props<
		TData extends {
			uploadIds: string[];
		},
	> extends Button.Props {
		withMutation: withMutation.Api<TData, any, any>;
		toMutation(uploadIds: string[]): TData;
		onSuccess(): void;
		onCancel(): void;
	}
}

export const GalleryUploadButton = <
	TData extends {
		uploadIds: string[];
	},
>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	...props
}: GalleryUploadButton.Props<TData>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [uploadIds, setUploadIds] = useState<string[]>([]);
	const mutation = withMutation.useMutation({
		async onPostMutation() {
			setIsOpen(false);
			setUploadIds([]);
			onSuccess();
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
				noClose
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					square={"md"}
					tone={"unset"}
					theme={"unset"}
				>
					<GalleryUpload
						state={{
							value: uploadIds,
							set: setUploadIds,
						}}
						limit={1}
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
							theme={"light"}
							size={"xl"}
							full
							confirmProps={{
								tone: "danger",
								theme: "dark",
								onClick() {
									setIsOpen(false);
									setUploadIds([]);
									onCancel();
								},
							}}
							disabled={mutation.isPending}
						/>

						<Button
							label={"Upload gallery (button)"}
							size={"xl"}
							full
							tone={"secondary"}
							theme={"light"}
							disabled={mutation.isPending || uploadIds.length === 0}
							loading={mutation.isPending}
							onClick={() => {
								mutation.mutate(toMutation(uploadIds));
							}}
						/>
					</div>
				</Container>
			</BottomSheet>
		</>
	);
};
