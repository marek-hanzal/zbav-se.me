import { type FC, Fragment } from "react";
import { match, P } from "ts-pattern";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { withCategoryAttrOfQuery } from "~/user/category/query/withCategoryAttrOfQuery";
import type { FeedSchema } from "../../server/schema/FeedSchema";
import { AttrEnumMulti } from "./attr/AttrEnumMulti";
import { AttrEnumSingle } from "./attr/AttrEnumSingle";
import { AttrNumericMax } from "./attr/AttrNumericMax";
import { AttrNumericMin } from "./attr/AttrNumericMin";
import { AttrYearMax } from "./attr/AttrYearMax";
import { AttrYearMin } from "./attr/AttrYearMin";

export namespace AttrEditor {
	export interface Props extends MarkSuspense.Props {
		feed: FeedSchema.Type;
		view: useView.Use<"default" | any>;
	}
}

export const AttrEditor: FC<AttrEditor.Props> = ({ _suspense, feed, view }) => {
	const { data: fields } = withCategoryAttrOfQuery.useSuspenseQuery({
		categoryId: feed.query?.filter?.categoryId ?? "<unknown>",
	});

	return fields.map((field) => {
		return match({
			field,
			attr: feed.query?.filter?.attrs?.[field.name],
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
						<view.Panel
							key={`field-${field.name}`}
							name={`attr.${field.name}`}
						>
							<AttrEnumSingle
								feed={feed}
								field={field}
								attr={attr}
								view={view}
							/>
						</view.Panel>
					);
				},
			)
			.with(
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
						<view.Panel
							key={`field-${field.name}`}
							name={`attr.${field.name}`}
						>
							<AttrEnumMulti
								feed={feed}
								field={field}
								attr={attr}
								view={view}
							/>
						</view.Panel>
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
				{
					field: {
						type: "range",
					},
					attr: P.union(
						{
							type: "range",
						},
						undefined,
					),
				},
				({ field, attr }) => {
					return (
						<Fragment key={`field-${field.name}`}>
							<view.Panel
								key={`field-${field.name}.min`}
								name={`attr.${field.name}.min`}
							>
								<AttrNumericMin
									feed={feed}
									field={field}
									attr={attr}
									view={view}
								/>
							</view.Panel>

							<view.Panel
								key={`field-${field.name}.max`}
								name={`attr.${field.name}.max`}
							>
								<AttrNumericMax
									feed={feed}
									field={field}
									attr={attr}
									view={view}
								/>
							</view.Panel>
						</Fragment>
					);
				},
			)
			.with(
				{
					field: {
						type: "year",
					},
					attr: P.union(
						{
							type: "year",
						},
						undefined,
					),
				},
				({ field, attr }) => {
					return (
						<Fragment key={`field-${field.name}`}>
							<view.Panel
								key={`field-${field.name}.min`}
								name={`attr.${field.name}.min`}
							>
								<AttrYearMin
									feed={feed}
									field={field}
									attr={attr}
									view={view}
								/>
							</view.Panel>

							<view.Panel
								key={`field-${field.name}.max`}
								name={`attr.${field.name}.max`}
							>
								<AttrYearMax
									feed={feed}
									field={field}
									attr={attr}
									view={view}
								/>
							</view.Panel>
						</Fragment>
					);
				},
			)
			.otherwise(() => {
				return null;
			});
	});
};
