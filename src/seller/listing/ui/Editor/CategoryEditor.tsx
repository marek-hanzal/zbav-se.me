import type { FC } from "react";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withCategoryFieldsQuery } from "~/user/category/query/withCategoryFieldsQuery";

export namespace CategoryEditor {
	export interface Props extends MarkSuspense.Props {
		categoryId: string | undefined | null;
	}
}

export const CategoryEditor: FC<CategoryEditor.Props> = ({ _suspense, categoryId }) => {
	const { data: fields } = withCategoryFieldsQuery.useSuspenseQuery({
		id: categoryId ?? "unknown",
	});

	if (!categoryId || !fields.length) {
		return null;
	}

	console.log("Fields", fields);

	return (
		<>
			<Tx
				label="Draft - category spec - required (title)"
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<div>fieldy, pyco</div>
		</>
	);
};
