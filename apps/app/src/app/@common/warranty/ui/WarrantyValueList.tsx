import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace WarrantyValueList {
	export interface Item {
		id: string;
		warranty: string;
	}

	export interface Props extends ValueList.PropsEx<Item> {
		warrantyIn: tListingWarrantyEnum[];
	}
}

/**
 * Renders a read-only list of warranty values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple warranty entries clearly.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
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
				ui:
					warrantyIn.length > 0
						? {
								tone: "neutral",
								theme: "light",
							}
						: undefined,
			}}
			{...props}
		/>
	);
};
