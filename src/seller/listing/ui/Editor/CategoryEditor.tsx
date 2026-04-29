import type { FC } from "react";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";

export namespace CategoryEditor {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		categoryId: string | undefined | null;
	}
}

export const CategoryEditor: FC<CategoryEditor.Props> = ({ _suspense, listingId, categoryId }) => {
	const { data: fields } = withAttrOfQuery.useSuspenseQuery({
		listingId,
		categoryId: categoryId ?? "unknown",
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
