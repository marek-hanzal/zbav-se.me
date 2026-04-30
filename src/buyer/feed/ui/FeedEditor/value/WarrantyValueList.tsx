import type { FC } from "react";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import type { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";

export namespace WarrantyValueList {
	export interface Item {
		id: string;
		warranty: string;
	}

	export interface Props extends Omit<ValueList.PropsEx<Item>, "items" | "renderFn"> {
		warrantyIn: ListingWarrantyEnumSchema.Type[];
	}
}

/**
 * Renders a read-only list of warranty values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple warranty entries clearly.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const WarrantyValueList: FC<WarrantyValueList.Props> = ({ warrantyIn, ...props }) => {
	return (
		<ValueList
			data-ui={"WarrantyValueList[ValueList]"}
			textLabel={translator.text("Listing warranty (label)")}
			textEmpty={translator.text("Warranty not selected")}
			items={warrantyIn.map((item) => ({
				id: item,
				warranty: item,
			}))}
			renderFn={(item) => translator.text(`Listing warranty - ${item.warranty}`)}
			wrapperProps={{
				...(warrantyIn.length > 0
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
