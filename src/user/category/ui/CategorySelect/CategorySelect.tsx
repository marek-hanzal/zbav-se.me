import { type FC, Suspense, useEffect, useRef, useState } from "react";
import { Container } from "@/lib/client/container";
import { Fulltext } from "@/lib/client/fulltext";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { ListContainer } from "./ListContainer";

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
