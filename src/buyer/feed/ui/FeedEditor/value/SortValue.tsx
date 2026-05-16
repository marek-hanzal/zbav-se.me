import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { ValueList } from "@/lib/client/value";

export namespace SortValue {
	export interface Sort {
		field: string;
		order: string;
	}

	export interface Props
		extends Omit<
			ValueList.PropsEx<
				Sort & {
					id: string;
				}
			>,
			"items" | "renderFn"
		> {
		sort: Sort[];
	}
}

/**
 * Renders a read-only sort value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const SortValue: FC<SortValue.Props> = ({ sort, ...props }) => {
	const translator = useTranslator();
	return (
		<ValueList
			data-ui={"SortValue"}
			textLabel={translator.text("Feed sorting (label)")}
			textEmpty={translator.text("Feed sorting not selected")}
			items={sort.map((sortItem, index) => ({
				id: `${sortItem.field}-${index}`,
				...sortItem,
			}))}
			renderFn={(sortItem) => (
				<Tx
					label={`Listing common sort value ${sortItem.field} - ${sortItem.order}`}
					data-ui-tone="secondary"
				/>
			)}
			wrapperProps={{
				...(sort.length > 0
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
