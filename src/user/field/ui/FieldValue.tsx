import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import type { FieldSchema } from "../server/schema/FieldSchema";

export namespace FieldValue {
	export interface Props extends LabelValue.PropsEx {
		field: FieldSchema.Type;
	}
}

export const FieldValue: FC<FieldValue.Props> = ({ field, ...props }) => {
	return (
		<LabelValue
			textLabel={translator.text(`Field - ${field.name}`)}
			textValue={null}
			{...props}
		/>
	);
};
