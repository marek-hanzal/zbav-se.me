import { type FC, Fragment } from "react";
import { match, P } from "ts-pattern";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { AttrEnumMulti } from "~/buyer-feed/ui/FeedEditor/AttrEnumMulti";
import { AttrEnumSingle } from "~/buyer-feed/ui/FeedEditor/AttrEnumSingle";
import { AttrNumericMax } from "~/buyer-feed/ui/FeedEditor/AttrNumericMax";
import { AttrNumericMin } from "~/buyer-feed/ui/FeedEditor/AttrNumericMin";
import { AttrYearMax } from "~/buyer-feed/ui/FeedEditor/AttrYearMax";
import { AttrYearMin } from "~/buyer-feed/ui/FeedEditor/AttrYearMin";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { withCategoryAttrOfQuery } from "~/user-category/query/withCategoryAttrOfQuery";
import type { useView } from "~/view/hook/useView";

export namespace AttrEditor {
	export interface Props extends MarkSuspense.Props {
		feed: FeedSchema.Type;
		view: useView.Use<"default" | any>;
	}
}

export const AttrEditor: FC<AttrEditor.Props> = ({ _suspense, feed, view }) => {
	const { data: fields } = withCategoryAttrOfQuery.useSuspenseQuery({
		categoryId: feed.query?.where?.categoryId ?? "<unknown>",
	});

	return fields.map((field) => {
		return match({
			field,
			attr: feed.query?.where?.attrs?.[field.name],
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
