import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { withCategoryAttrOfQuery } from "~/user/category/query/withCategoryAttrOfQuery";
import type { FeedSchema } from "../../server/schema/FeedSchema";
import { AttrValue } from "./value/AttrValue";

export namespace AttrValues {
	export interface Props extends MarkSuspense.Props {
		feed: FeedSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrValues: FC<AttrValues.Props> = ({ _suspense, feed, view }) => {
	const { data: fields } = withCategoryAttrOfQuery.useSuspenseQuery({
		categoryId: feed.query?.filter?.categoryId ?? "<unknown>",
	});

	if (!fields.length) {
		return null;
	}

	return (
		<>
			<Tx
				label="Feed - dynamic fields (title)"
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				{fields.map((field) => {
					return (
						<AttrValue
							key={`feed-attr-${field.name}`}
							field={field}
							attr={feed.query?.filter?.attrs?.[field.name]}
							view={view}
						/>
					);
				})}
			</Container>
		</>
	);
};
