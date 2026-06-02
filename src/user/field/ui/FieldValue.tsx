import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";
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
