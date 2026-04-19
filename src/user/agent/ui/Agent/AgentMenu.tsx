import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { withProxyMutation } from "~/common/gallery/mutation/withProxyMutation";
import { GalleryUploadButton } from "~/common/gallery/ui/GalleryUploadButton";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import { ClearButton } from "./ClearButton";

export namespace AgentMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		onUpload?(uploads: UploadSchema.Type[]): void;
	}
}

export const AgentMenu: FC<AgentMenu.Props> = ({ close, onUpload, ...props }) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			data-ui={"AgentMenu"}
			data-ui-flow="vertical"
			data-ui-gap="md"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
		>
			<Group>
				<GalleryUploadButton
					defaultUploadIds={[]}
					state={{
						value: isGalleryOpen,
						set: setIsGalleryOpen,
					}}
					withMutation={withProxyMutation}
					toMutation={(uploadIds) => ({
						uploadIds,
					})}
					onSuccess={async (result) => {
						setIsGalleryOpen(false);
						onUpload?.(result);
						close();
					}}
					onCancel={() => {
						setIsGalleryOpen(false);
					}}
					{...MessageButtonUi}
				/>
			</Group>

			<Group>
				<ClearButton
					onSuccess={async () => {
						close();
					}}
					{...TransactionButtonUi}
				/>
			</Group>
		</Container>
	);
};
