import type { EntrySchema } from "~/database/schema/TransactionEntryTableEntrySchema";
import type { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ValueList } from "~/ui/ui/ValueList";

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
