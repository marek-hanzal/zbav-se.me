import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";
import type { CategorySchema } from "~/public/category/server/schema/CategorySchema";
import { CategoryInline } from "./CategoryInline";

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
			textLabel={translator.text("Listing category (label)")}
			textEmpty={translator.text("Listing category not selected")}
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
