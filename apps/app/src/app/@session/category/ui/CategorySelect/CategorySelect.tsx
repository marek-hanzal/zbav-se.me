import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, Suspense, useState } from "react";
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
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
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
