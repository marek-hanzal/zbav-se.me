import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { ClearButton } from "./ClearButton";

export namespace AgentMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
	}
}

export const AgentMenu: FC<AgentMenu.Props> = ({ close, ...props }) => {
	// const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			data-ui={"AgentMenu"}
			data-ui-flow="vertical"
			data-ui-gap="md"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
		>
			{/* <Group>
				<GalleryUploadButton
					defaultUploadIds={[]}
					state={{
						value: isGalleryOpen,
						set: setIsGalleryOpen,
					}}
					withMutation={withTransactionEntryGalleryCreateMutation}
					toMutation={(uploadIds) => ({
						transactionId: transaction.id,
						uploadIds,
					})}
					onSuccess={async () => {
						setIsGalleryOpen(false);
						close();
					}}
					onCancel={() => {
						setIsGalleryOpen(false);
					}}
					{...MessageButtonUi}
				/>
			</Group> */}

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
