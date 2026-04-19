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
