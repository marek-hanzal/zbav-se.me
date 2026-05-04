import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { LabelValue, ValueList } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translation";
import type { AttrWhereSchema } from "~/buyer/listing/server/schema/AttrWhereSchema";
import type { CategoryAttrOfSchema } from "~/user/category/server/schema/CategoryAttrOfSchema";

export namespace AttrValue {
	export interface Props {
		field: CategoryAttrOfSchema.Type;
		attr: AttrWhereSchema.Type | undefined;
		view: useView.Use<any>;
	}
}

export const AttrValue: FC<AttrValue.Props> = ({ field, attr, view }) => {
	const locale = useLocale();

	return match({
		field,
		attr,
	})
		.with(
			{
				field: {
					type: "enum-single",
				},
				attr: P.union(
					{
						type: "enum-single",
					},
					undefined,
				),
			},
			{
				field: {
					type: "enum-multi",
				},
				attr: P.union(
					{
						type: "enum-multi",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group>
						<ValueList
							textLabel={translator.text(`Field - ${field.name}`)}
							textEmpty={translator.text("No value here (label)")}
							items={
								attr?.value?.map((id) => ({
									id,
								})) ?? []
							}
							renderFn={({ id }) => {
								return translator.text(`${field.name} - ${id}`, id);
							}}
							onClick={() => {
								view.set(`attr.${field.name}`);
							}}
						/>
					</Group>
				);
			},
		)
		.with(
			{
				field: {
					type: "number",
				},
				attr: P.union(
					{
						type: "number",
					},
					undefined,
				),
			},
			{
				field: {
					type: "decimal",
				},
				attr: P.union(
					{
						type: "decimal",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group>
						<LabelValue
							textLabel={translator.text(`Field - ${field.name} - min`)}
							textEmpty={translator.text("No value here (label)")}
							textValue={
								attr?.min
									? toLocaleNumber({
											locale,
											number: attr.min,
										})
									: null
							}
							onClick={() => {
								view.set(`attr.${field.name}.min`);
							}}
						/>
						<LabelValue
							textLabel={translator.text(`Field - ${field.name} - max`)}
							textEmpty={translator.text("No value here (label)")}
							textValue={
								attr?.max
									? toLocaleNumber({
											locale,
											number: attr.max,
										})
									: null
							}
							onClick={() => {
								view.set(`attr.${field.name}.max`);
							}}
						/>
					</Group>
				);
			},
		)
		.otherwise(() => {
			return "nope";
		});
};
