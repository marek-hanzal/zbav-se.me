import { type FC, Suspense, useEffect, useRef, useState } from "react";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";
import { Fulltext } from "~/ui/ui/Fulltext";
import { ListContainer } from "~/user-category/ui/CategorySelect/ListContainer/index";

export namespace CategorySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Use<EntitySchema.Type>;
		/**
		 * Scroll to the given category
		 */
		categoryId: string | undefined;
		withRestriction: boolean;
	}
}

/**
 * Provides an interactive control for selecting category values in forms.
 * Use it in editors where users need to choose or update category before saving.
 */
export const CategorySelect: FC<CategorySelect.Props> = ({
	selection,
	categoryId,
	withRestriction,
	...props
}) => {
	const focusRef = useRef<HTMLInputElement>(null);
	const [fulltext, setFulltext] = useState<Fulltext.Value>();

	useEffect(() => {
		focusRef.current?.focus();
	}, []);

	return (
		<Container
			data-ui={"CategorySelect"}
			data-ui-layout="vertical-header-content"
			data-ui-height="full"
			data-ui-gap="default"
			{...props}
		>
			<Fulltext
				ref={focusRef}
				autoFocus
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
					withRestriction={withRestriction}
				/>
			</Suspense>
		</Container>
	);
};
