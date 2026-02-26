import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace WarrantyValueList {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				warranty: string;
			}>,
			"items" | "renderFn"
		> {
		warrantyIn: tListingWarrantyEnum[];
	}
}

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
			renderFn={(item) => <Tx label={`Listing warranty - ${item.warranty}`} />}
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
