import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { StateType } from "@/lib/client/type";
import { PhotoIcon } from "~/common/ui/icon";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

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
