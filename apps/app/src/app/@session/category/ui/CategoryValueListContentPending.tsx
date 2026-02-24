import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tCategoryItem } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace CategoryValueListContentPending {
	export interface Props extends ValueList.PropsEx<tCategoryItem> {
		//
	}
}

export const CategoryValueListContentPending: FC<CategoryValueListContentPending.Props> = ({
	...props
}) => {
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
};
