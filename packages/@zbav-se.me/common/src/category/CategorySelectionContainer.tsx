import type { useSelection } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, Suspense, useState } from "react";
import { ListContainer } from "./CategorySelectionContainer/ListContainer";

export namespace CategorySelectionContainer {
	export interface Props extends Container.Props {
		locale: string;
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const CategorySelectionContainer: FC<CategorySelectionContainer.Props> = ({
	locale,
	selection,
	categoryId,
	...props
}) => {
	const [fulltext, setFulltext] = useState<Fulltext.Value>();

	return (
		<Container
			layout={"vertical-header-content"}
			gap={"md"}
			height={"fit"}
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
