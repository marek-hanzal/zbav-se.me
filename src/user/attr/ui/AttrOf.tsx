import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import type { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import type { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translation";
import type { AttrOfSchema } from "../server/schema/AttrOfSchema";

export namespace AttrOf {
	export interface Props {
		attrOf: AttrOfSchema.Type;
		textLabelProps?: Typo.PropsEx;
		wrapperProps?: Container.Props;
		action?: ReactNode;
		onClick?(): void;
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
						textEmpty={translator.text("No value here (label)")}
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
						textValue={
							attr.value
								? translator.text(
										`Field Enum - ${attr.name} - ${attr.value}`,
										attr.value ?? "",
									)
								: null
						}
						textEmpty={translator.text("No value here (label)")}
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
						textValue={
							attr.value
								? toLocaleNumber({
										locale,
										number: attr.value,
									})
								: null
						}
						textEmpty={translator.text("No value here (label)")}
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
						textEmpty={translator.text("No value here (label)")}
						items={attr.value.map((item) => ({
							id: item,
						}))}
						renderFn={({ id }) => {
							return translator.text(`Field Enum - ${attr.name} - ${id}`, id);
						}}
						{...props}
					/>
				);
			},
		)
		.exhaustive();
};
