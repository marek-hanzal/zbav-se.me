import { DateTime } from "luxon";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import type { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { uiSelectButton } from "~/common/ui/ui";

export namespace Item {
	export interface Props {
		expire: ListingExpireEnumSchema.Type;
		isSelected: boolean;
		onChange(value: ListingExpireEnumSchema.Type): void;
	}
}

export const Item: FC<Item.Props> = ({ expire, isSelected, onChange }) => {
	return (
		<Button
			onClick={() => {
				onChange(expire);
			}}
			{...uiSelectButton({
				isSelected,
				"data-ui-flow": "horizontal",
				"data-ui-justify": "space-between",
				className: [],
			})}
			data-ui={`ExpireAtSelect-[Button.${expire}]`}
		>
			<Tx
				label={`Expire in ${expire}`}
				data-ui-font="bold"
			/>

			<Typo
				label={match(expire)
					.with("7-days", () =>
						DateTime.now()
							.plus({
								days: 7,
							})
							.toFormat("dd.MM.yyyy"),
					)
					.with("14-days", () =>
						DateTime.now()
							.plus({
								days: 14,
							})
							.toFormat("dd.MM.yyyy"),
					)
					.with("1-month", () =>
						DateTime.now()
							.plus({
								months: 1,
							})
							.toFormat("dd.MM.yyyy"),
					)
					.exhaustive()}
				data-ui-text="md"
			/>
		</Button>
	);
};
