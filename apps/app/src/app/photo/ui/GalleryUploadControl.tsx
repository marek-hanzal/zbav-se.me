import type { withMutation } from "@use-pico/client/mutation";
import { Container } from "@use-pico/client/ui/container";
import { useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";
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
		limit?: number;
	}
}

export const GalleryUploadControl = <TData extends GalleryUploadControl.Uploads>({
	withMutation,
	toMutation,
	onCancel,
	onSuccess,
	ui,
	limit = 1,
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
				limit={limit}
			/>

			<SaveControl
				onCancel={() => {
					setUploadIds([]);
					onCancel();
				}}
				onSave={() => {
					mutation.mutate(toMutation(uploadIds));
				}}
				loading={mutation.isPending}
				disabled={uploadIds.length === 0}
			/>
		</Container>
	);
};
