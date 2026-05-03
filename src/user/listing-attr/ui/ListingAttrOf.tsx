import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import type { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import type { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translation";
import type { ListingAttrOfSchema } from "../server/schema/ListingAttrOfSchema";

export namespace ListingAttrOf {
	export interface Props {
		attrOf: ListingAttrOfSchema.Type;
		textLabelProps?: Typo.PropsEx;
		wrapperProps?: Container.Props;
		action?: ReactNode;
		onClick?(): void;
	}
}

export const ListingAttrOf: FC<ListingAttrOf.Props> = ({ attrOf, ...props }) => {
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
								? translator.text(`${attr.name} - ${attr.value}`, attr.value)
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
								? translator.text(`${attr.name} - ${attr.value}`, attr.value)
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
			{
				type: "range",
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
				type: "year",
			},
			(attr) => {
				return (
					<LabelValue
						textLabel={translator.text(`Field - ${attr.name}`)}
						textValue={attr.value ? String(attr.value) : null}
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
							return translator.text(`${attr.name} - ${id}`, id);
						}}
						{...props}
					/>
				);
			},
		)
		.exhaustive();
};
