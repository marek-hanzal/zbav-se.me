import type { useSelection } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, Suspense, useState } from "react";
import { ListContainer } from "./CategorySelectionContainer/ListContainer";

export namespace CategorySelect {
	export interface Props extends Container.Props {
		locale: string;
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const CategorySelect: FC<CategorySelect.Props> = ({
	locale,
	selection,
	categoryId,
	ui,
	...props
}) => {
	const [fulltext, setFulltext] = useState<Fulltext.Value>();

	return (
		<Container
			data-ui={"CategorySelectionContainer"}
			ui={{
				layout: "vertical-header-content",
				height: "full",
				scroll: "vertical",
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

			<Suspense fallback={<SpinnerContainer />}>
				<ListContainer
					_suspense={"I know"}
					locale={locale}
					fulltext={fulltext}
					selection={selection}
					categoryId={categoryId}
				/>
			</Suspense>
		</Container>
	);
};
