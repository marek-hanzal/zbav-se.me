import { Suspense } from "react";
import { withFallback } from "@/lib/client/fallback";
import type { MarkSuspense } from "@/lib/client/type";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
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
 *
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
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

		const { data: categoryIds } = withCategoryQuery.useIdsQuery({
			where: {
				idIn: categoryIdIn,
			},
		});

		return (
			<ValueList
				renderFn={(item) => (
					<Suspense fallback={<CategoryInline.Fallback />}>
						<CategoryInline
							_suspense={"I know"}
							categoryId={item.id}
						/>
					</Suspense>
				)}
				items={categoryIds.map((id) => ({
					id,
				}))}
				wrapperProps={{
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
				}}
				{...props}
			/>
		);
	},
	(props: ValueList.PropsEx<CategorySchema.Type>) => {
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
