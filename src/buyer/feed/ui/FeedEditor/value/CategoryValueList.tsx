import { withFallback } from "@/lib/client/fallback";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { ValueList } from "@/lib/client/value";
import { withCategoryQuery } from "~/user/category/query/withCategoryQuery";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { CategoryInline } from "~/user/category/ui/CategoryInline";

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
export const CategoryValueList = withFallback(
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
				textLabel={translator.text("Loading... (label)")}
				textEmpty={translator.text("No categories found (label)")}
				renderFn={() => null}
				items={[]}
				loading={true}
				{...props}
			/>
		);
	},
);
