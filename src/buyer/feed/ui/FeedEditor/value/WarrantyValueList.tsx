import type { FC } from "react";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";

export namespace WarrantyValueList {
	export interface Item {
		id: string;
		warranty: string;
	}

	export interface Props extends Omit<ValueList.PropsEx<Item>, "items" | "renderFn"> {
		warrantyIn: WarrantyEnumSchema.Type[];
	}
}

/**
 * Renders a read-only list of warranty values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple warranty entries clearly.
 */
export const WarrantyValueList: FC<WarrantyValueList.Props> = ({ warrantyIn, ...props }) => {
	return (
		<ValueList
			data-ui={"WarrantyValueList"}
			textLabel={translator.text("Listing warranty (label)")}
			textEmpty={translator.text("Warranty not selected")}
			items={warrantyIn.map((item) => ({
				id: item,
				warranty: item,
			}))}
			renderFn={(item) => translator.text(`Listing warranty - ${item.warranty}`)}
			data-ui-theme={"light"}
			wrapperProps={{
				"data-ui-tone": warrantyIn.length > 0 ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
