import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Group } from "@/lib/client/group";
import { ValueList } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
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
		.otherwise(() => {
			return "nope";
		});
};
