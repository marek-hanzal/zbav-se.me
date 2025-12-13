import type { withMutation } from "@use-pico/client/mutation";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { useState } from "react";
import { GalleryUpload } from "./GalleryUpload";

export namespace GalleryUploadControl {
	export interface Uploads {
		uploadIds: string[];
	}

	export interface Props<TData extends Uploads> extends Container.Props {
		withMutation: withMutation.Api<TData, any, any>;
		toMutation(uploadIds: string[]): TData;
		//
		onCancel(): void;
		onSuccess(): void;
	}
}

export const GalleryUploadControl = <TData extends GalleryUploadControl.Uploads>({
	withMutation,
	toMutation,
	onCancel,
	onSuccess,
	ui,
	...props
}: GalleryUploadControl.Props<TData>) => {
	const [uploadIds, setUploadIds] = useState<string[]>([]);
	const mutation = withMutation.useMutation({
		async onPostMutation() {
			setUploadIds([]);
			onSuccess();
		},
	});

	return (
		<Container
			data-ui={"GalleryUploadControl-[Container]"}
			ui={{
				layout: "vertical-content-footer",
				gap: "default",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<GalleryUpload
				state={{
					value: uploadIds,
					set: setUploadIds,
				}}
				limit={1}
			/>

			<Container
				data-ui={"GalleryUploadControl-[Container.buttons]"}
				ui={{
					flow: "horizontal",
					justify: "space-evenly",
					items: "center",
					gap: "default",
				}}
			>
				<ConfirmButton
					label={"Cancel (button)"}
					confirmProps={{
						ui: {
							tone: "danger",
							theme: "light",
						},
						onClick() {
							setUploadIds([]);
							onCancel();
						},
					}}
					disabled={mutation.isPending}
					ui={{
						tone: "warning",
						theme: "light",
						size: "xl",
					}}
				/>

				<Button
					label={"Upload gallery (button)"}
					disabled={mutation.isPending || uploadIds.length === 0}
					loading={mutation.isPending}
					onClick={() => {
						mutation.mutate(toMutation(uploadIds));
					}}
					ui={{
						tone: "secondary",
						theme: "light",
						size: "xl",
					}}
				/>
			</Container>
		</Container>
	);
};
