import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace SortValue {
	export interface Sort {
		field: string;
		direction: string;
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

export const SortValue: FC<SortValue.Props> = ({ sort, ...props }) => {
	return (
		<ValueList
			data-ui={"SortValue[ValueList]"}
			textLabel={translator.text("Feed sorting (label)")}
			textEmpty={translator.text("Feed sorting not selected")}
			textHint={translator.text("Feed sorting (hint)")}
			items={sort.map((sortItem, index) => ({
				id: `${sortItem.field}-${index}`,
				...sortItem,
			}))}
			renderFn={(sortItem) => (
				<Tx
					label={`Listing common sort value ${sortItem.field} - ${sortItem.direction}`}
					ui={{
						tone: "secondary",
					}}
				/>
			)}
			wrapperProps={{
				ui:
					sort.length > 0
						? {
								tone: "neutral",
								theme: "light",
							}
						: undefined,
			}}
			{...props}
		/>
	);
};
