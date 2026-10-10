import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";
import type { FieldSchema } from "../server/schema/FieldSchema";

export namespace FieldValue {
	export interface Props extends LabelValue.PropsEx {
		field: FieldSchema.Type;
	}
}

export const FieldValue: FC<FieldValue.Props> = ({ field, ...props }) => {
	const translator = useTranslator();
	return (
		<LabelValue
			textLabel={translator.text(`Field - ${field.name}`)}
			textValue={null}
			{...props}
		/>
	);
};
