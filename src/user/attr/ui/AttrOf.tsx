import type { FC } from "react";
import { match } from "ts-pattern";
import { useLocale } from "@/lib/client/locale";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translator";
import type { AttrOfSchema } from "../server/schema/AttrOfSchema";

export namespace AttrOf {
	export interface Props extends LabelValue.PropsEx {
		attrOf: AttrOfSchema.Type;
	}
}

export const AttrOf: FC<AttrOf.Props> = ({ attrOf, ...props }) => {
	const locale = useLocale();

	return match(attrOf)
		.with(
			{
				type: "text",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.text(`Field - ${attr.name}`)}
						textValue={
							attr.value
								? translator.text(
										`Field - ${attr.name} - ${attr.value}`,
										attr.value,
									)
								: null
						}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				type: "enum-single",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.text(`Field - ${attr.name}`)}
						textValue={translator.text(
							`Field Enum - ${attr.name} - ${attr.value}`,
							attr.value ?? "",
						)}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				type: "number",
			},
			{
				type: "decimal",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.text(`Field - ${attr.name}`)}
						textValue={toLocaleNumber({
							locale,
							number: attr.value,
						})}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				type: "enum-multi",
			},
			(attr) => {
				return (
					<ValueList
						textLabel={translator.text(`Field - ${attr.name}`)}
						textEmpty={translator.text(`Field - ${attr.name} - empty`)}
						items={attr.value.map((item) => ({
							id: item,
						}))}
						renderFn={({ id }) => {
							return translator.text(`Field Enum - ${attr.name} - ${id}`, id);
						}}
					/>
				);
			},
		)
		.exhaustive();
};
