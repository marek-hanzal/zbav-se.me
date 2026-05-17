import { useTranslator } from "@/lib/client/translation";
import { ValueList } from "@/lib/client/value";
import type { EntrySchema } from "~/server/database/@table/TransactionEntryTableSchema/EntrySchema";
import type { PriceTypeEnumSchema } from "../enum/PriceTypeEnumSchema";

export namespace PriceTypeList {
	export interface Props extends Omit<ValueList.PropsEx<EntrySchema.Type>, "items" | "renderFn"> {
		priceType: PriceTypeEnumSchema.Type[];
	}
}

export const PriceTypeList: React.FC<PriceTypeList.Props> = ({ priceType, ...props }) => {
	const translator = useTranslator();
	return (
		<ValueList
			data-ui={"PriceTypeList"}
			textLabel={translator.text("Price type (title)")}
			textEmpty={translator.text("Price type not set")}
			items={priceType.map((item) => ({
				id: item,
			}))}
			renderFn={(item) => {
				return translator.text(`Price Type - ${item.id} (label)`);
			}}
			wrapperProps={{
				"data-ui-tone": priceType.length > 0 ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
