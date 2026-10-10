import { CategoryInline } from "~/category/ui/CategoryInline";
import { useTranslator } from "~/translation/hook/useTranslator";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { ValueList } from "~/ui/ui/ValueList";
import { withCategoryQuery } from "~/user-category/query/withCategoryQuery";
import type { CategorySchema } from "~/user-category/schema/CategorySchema";

export namespace CategoryValueList {
	export interface Props
		extends Omit<ValueList.Props<CategorySchema.Type>, "items" | "renderFn">,
			MarkSuspense.Props {
		categoryIdIn: string[] | undefined | null;
	}
}

/**
 * Renders a read-only list of category values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple category entries clearly.
 */
export const CategoryValueList = withFallbackFn(
	({ _suspense, categoryIdIn, ...props }: CategoryValueList.Props) => {
		if (!categoryIdIn || categoryIdIn.length === 0) {
			return (
				<ValueList
					renderFn={() => null}
					items={[]}
					{...props}
				/>
			);
		}

		const { data: categories } = withCategoryQuery.useCollectionQuery({
			where: {
				idIn: categoryIdIn,
			},
		});

		return (
			<ValueList
				items={categories}
				renderFn={(item) => <CategoryInline category={item} />}
				wrapperProps={{
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
				}}
				{...props}
			/>
		);
	},
	({
		...props
	}: Omit<CategoryValueList.Props, "_suspense" | "categoryIdIn" | "textLabel" | "textEmpty">) => {
		const translator = useTranslator();
		return (
			<ValueList
				textLabel={translator.textFn("Loading... (label)")}
				textEmpty={translator.textFn("No categories found (label)")}
				renderFn={() => null}
				items={[]}
				loading={true}
				{...props}
			/>
		);
	},
);
