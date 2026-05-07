import { type FC, useId, useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";
import { PhotoIcon } from "~/common/ui/icon";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";
import { withUploadMutation } from "~/user/upload/mutation/withUploadMutation";

export namespace GalleryButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transactionId: string;
	}
}

export const GalleryButton: FC<GalleryButton.Props> = ({ close, transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [uploadIds, setUploadIds] = useState<string[]>([]);
	const mutationId = useId();
	const isUploading = withUploadMutation.useIsMutating({
		mutationId,
	});
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			setIsOpen(false);
			close();
		},
	});

	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				data-ui-tone="primary"
				data-ui-theme="light"
				data-ui-size="xl"
				data-ui-justify="start"
				{...props}
			>
				<Tx label="Upload photos (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"default"}
			>
				<GalleryUpload
					access="protected"
					state={{
						value: uploadIds,
						set: setUploadIds,
					}}
					limit={10}
					mutationId={mutationId}
					data-ui-height="full"
				/>

				<SaveContainer
					onCancel={() => {
						setUploadIds([]);
						setIsOpen(false);
					}}
					onSave={() => {
						mutation.mutate({
							transactionId,
							kind: "gallery",
							payload: {
								uploadIds,
							},
						});
					}}
					loading={mutation.isPending}
					disabled={isUploading || uploadIds.length === 0}
				/>
			</BottomSheet>
		</>
	);
};
