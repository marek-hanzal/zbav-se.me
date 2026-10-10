import type { FC } from "react";
import { PhotoIcon } from "~/application-ui/constant/icon.exports";
import { Tx } from "~/translation/ui/Tx";
import type { StateType } from "~/ui/type/StateType";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace AgentMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		galleryState: StateType.State<boolean>;
		isPending: boolean;
	}
}

export const AgentMenu: FC<AgentMenu.Props> = ({ close, galleryState, isPending, ...props }) => {
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
				<Button
					iconEnabled={PhotoIcon}
					disabled={isPending}
					loading={isPending}
					onClick={() => {
						if (isPending) {
							return;
						}

						galleryState.set(true);
						close();
					}}
					{...MessageButtonUi}
				>
					<Tx label="Upload photos (button)" />
				</Button>
			</Group>
		</Container>
	);
};
