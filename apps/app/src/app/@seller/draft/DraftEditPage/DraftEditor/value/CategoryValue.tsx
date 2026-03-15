import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { type FC, Suspense } from "react";
import { CategoryInline } from "~/app/@session/category/ui/CategoryInline/CategoryInline";

export namespace CategoryValue {
	export interface Props extends LabelValue.PropsEx {
		categoryId: string | undefined | null;
	}
}

/**
 * Renders a read-only category value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryValue: FC<CategoryValue.Props> = ({ categoryId, ...props }) => {
	return (
		<LabelValue
			data-ui={"CategoryValue[LabelValue]"}
			textLabel={translator.text("Listing category (label)")}
			textValue={
				categoryId ? (
					<Suspense fallback={<CategoryInline.Fallback />}>
						<CategoryInline
							categoryId={categoryId}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Suspense>
				) : null
			}
			textEmpty={translator.text("Listing category not selected")}
			{...props}
		/>
	);
};
