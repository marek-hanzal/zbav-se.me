import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import type { Typo } from "~/ui/ui/Typo";
import { ValueList } from "~/ui/ui/ValueList";
import type { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";

export namespace DraftAttrOf {
	export interface Props {
		attrOf: DraftAttrOfSchema.Type;
		textLabelProps?: Typo.PropsEx;
		wrapperProps?: Container.Props;
		action?: ReactNode;
		onClick?(): void;
	}
}

export const DraftAttrOf: FC<DraftAttrOf.Props> = ({ attrOf, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return match(attrOf)
		.with(
			{
				type: "text",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.textFn(`Field - ${attr.name}`)}
						textValue={
							attr.value
								? translator.textFn(`${attr.name} - ${attr.value}`, attr.value)
								: null
						}
						textEmpty={translator.textFn("No value here (label)")}
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
						textLabel={translator.textFn(`Field - ${attr.name}`)}
						textValue={
							attr.value
								? translator.textFn(`${attr.name} - ${attr.value}`, attr.value)
								: null
						}
						textEmpty={translator.textFn("No value here (label)")}
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
			{
				type: "range",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.textFn(`Field - ${attr.name}`)}
						textValue={
							attr.value
								? toLocaleNumberFn({
										locale,
										number: attr.value,
									})
								: null
						}
						textEmpty={translator.textFn("No value here (label)")}
						{...props}
					/>
				);
			},
		)
		.with(
			{
				type: "year",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.textFn(`Field - ${attr.name}`)}
						textValue={attr.value ? String(attr.value) : null}
						textEmpty={translator.textFn("No value here (label)")}
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
						textLabel={translator.textFn(`Field - ${attr.name}`)}
						textEmpty={translator.textFn("No value here (label)")}
						items={attr.value.map((item) => ({
							id: item,
						}))}
						renderFn={({ id }) => {
							return translator.textFn(`${attr.name} - ${id}`, id);
						}}
						{...props}
					/>
				);
			},
		)
		.exhaustive();
};
