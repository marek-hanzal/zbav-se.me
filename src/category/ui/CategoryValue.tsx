import type { FC } from "react";
import { CategoryInline } from "~/category/ui/CategoryInline";
import type { CategorySchema } from "~/public-category/schema/CategorySchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace CategoryValue {
	export interface Props extends LabelValue.PropsEx {
		category: CategorySchema.Type | undefined | null;
	}
}

/**
 * Renders a read-only category value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const CategoryValue: FC<CategoryValue.Props> = ({ category, ...props }) => {
	const translator = useTranslator();
	return (
		<LabelValue
			data-ui={"CategoryValue"}
			textLabel={translator.textFn("Listing category (label)")}
			textEmpty={translator.textFn("Listing category not selected")}
			textValue={
				category ? (
					<CategoryInline
						category={category}
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				) : null
			}
			wrapperProps={{
				"data-ui-tone": category ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
