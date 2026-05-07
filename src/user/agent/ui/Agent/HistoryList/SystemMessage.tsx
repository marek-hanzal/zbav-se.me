import type { SystemMessageItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";

export namespace SystemMessage {
	export interface Props extends Container.Props {
		item: SystemMessageItem;
	}
}

export const SystemMessage: FC<SystemMessage.Props> = ({ item, ...props }) => {
	return (
		<Container
			data-ui={"SystemMessage"}
			data-ui-flow="vertical"
			data-ui-gap="xs"
			{...props}
		>
			<Typo
				label={item.content}
				data-ui-text="sm"
				data-ui-opacity="6"
			/>
		</Container>
	);
};
