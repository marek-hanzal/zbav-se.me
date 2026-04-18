import type { FC } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import { CategoryInline } from "~/session/category/ui/CategoryInline";

export namespace CategoryValue {
	export interface Props extends LabelValue.PropsEx, MarkSuspense.Props {
		categoryId: string | undefined | null;
	}
}

/**
 * Renders a read-only category value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryValue: FC<CategoryValue.Props> = ({ _suspense, categoryId, ...props }) => {
	return (
		<LabelValue
			data-ui={"CategoryValue"}
			textLabel={translator.text("Listing category (label)")}
			textValue={
				categoryId ? (
					<CategoryInline
						_suspense={"I know"}
						categoryId={categoryId}
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				) : null
			}
			textEmpty={translator.text("Listing category not selected")}
			{...props}
		/>
	);
};
