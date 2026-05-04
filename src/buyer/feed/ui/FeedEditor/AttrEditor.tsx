import type { FC } from "react";
import { match, P } from "ts-pattern";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { withCategoryAttrOfQuery } from "~/user/category/query/withCategoryAttrOfQuery";
import type { FeedSchema } from "../../server/schema/FeedSchema";
import { AttrEnumSingle } from "./attr/AttrEnumSingle";

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

	console.log("fields", fields);

	return fields.map((field) => {
		return match({
			field,
			attr: feed.query?.attrs?.[field.name],
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
			.otherwise(() => {
				return null;
			});
	});
};
