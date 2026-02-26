import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, useState } from "react";
import { ListContainer } from "./ListContainer";

export namespace CategorySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const CategorySelect: FC<CategorySelect.Props> = ({
	selection,
	categoryId,
	ui,
	...props
}) => {
	const [fulltext, setFulltext] = useState<Fulltext.Value>();

	return (
		<Container
			data-ui={"CategorySelect[Container]"}
			ui={{
				layout: "vertical-header-content",
				height: "full",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Fulltext
				state={{
					value: fulltext,
					set: setFulltext,
				}}
			/>

			<ListContainer
				fulltext={fulltext}
				selection={selection}
				categoryId={categoryId}
			/>
		</Container>
	);
};
