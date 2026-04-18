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
			ui={{
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<Typo
				label={item.content}
				ui={{
					text: "sm",
					opacity: "6",
				}}
			/>
		</Container>
	);
};
