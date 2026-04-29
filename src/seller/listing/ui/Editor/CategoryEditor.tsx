import type { FC } from "react";
import { Tx } from "@/lib/client/tx";

export namespace CategoryEditor {
	export interface Props {
		categoryId: string | undefined | null;
	}
}

export const CategoryEditor: FC<CategoryEditor.Props> = ({ categoryId }) => {
	if (!categoryId) {
		return null;
	}

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
