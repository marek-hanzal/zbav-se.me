import type { MarkSuspense } from "@use-pico/client/type";
import { ValueList } from "@use-pico/client/ui/container";
import { withFallback } from "@use-pico/client/utils";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import { Suspense } from "react";
import { CategoryInline } from "~/client/@session/category/ui/CategoryInline";

export namespace CategoryValueList {
	export interface Props
		extends Omit<ValueList.Props<tCategoryItem>, "items" | "renderFn">,
			MarkSuspense.Props {
		categoryIdIn: string[] | undefined | null;
	}
}

/**
 * Renders a read-only list of category values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple category entries clearly.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryValueList = withFallback(
	({ _suspense, categoryIdIn, ...props }: CategoryValueList.Props) => {
		if (!categoryIdIn || categoryIdIn.length === 0) {
			return (
				<ValueList<tCategoryItem>
					renderFn={() => null}
					items={[]}
					{...props}
				/>
			);
		}

		const { data: categoryIds } = withCategoryQuery.useCollectionQuery({
			where: {
				idIn: categoryIdIn,
			},
		});

		return (
			<ValueList<EntitySchema.Type>
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
					ui: {
						tone: "neutral",
						theme: "light",
					},
				}}
				{...props}
			/>
		);
	},
	(props: ValueList.PropsEx<tCategoryItem>) => {
		return (
			<ValueList<tCategoryItem>
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
