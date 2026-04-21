import { type FC, Suspense, useState } from "react";
import { Container } from "@/lib/client/container";
import { Fulltext } from "@/lib/client/fulltext";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { ListContainer } from "./ListContainer";

export namespace CategorySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

/**
 * Provides an interactive control for selecting category values in forms.
 * Use it in editors where users need to choose or update category before saving.
 *
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategorySelect: FC<CategorySelect.Props> = ({ selection, categoryId, ...props }) => {
	const [fulltext, setFulltext] = useState<Fulltext.Value>();

	return (
		<Container
			data-ui={"CategorySelect[Container]"}
			data-ui-layout="vertical-header-content"
			data-ui-height="full"
			data-ui-gap="default"
			{...props}
		>
			<Fulltext
				state={{
					value: fulltext,
					set: setFulltext,
				}}
			/>

			<Suspense fallback={<ListContainer.Fallback />}>
				<ListContainer
					fulltext={fulltext}
					selection={selection}
					categoryId={categoryId}
				/>
			</Suspense>
		</Container>
	);
};
