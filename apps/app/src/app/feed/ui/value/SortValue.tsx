import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace SortValue {
	export interface Props
		extends Omit<
			ValueList.PropsEx<
				tListingSort & {
					id: string;
				}
			>,
			"items" | "renderFn"
		> {
		feed: tFeed;
	}
}

export const SortValue: FC<SortValue.Props> = ({ feed, ...props }) => {
	const sort = feed.query?.sort ?? [];

	return (
		<ValueList
			data-ui={"SortValue[ValueList]"}
			textLabel={translator.text("Feed sorting (label)")}
			textEmpty={translator.text("Feed sorting not selected")}
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
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			{...props}
		/>
	);
};
