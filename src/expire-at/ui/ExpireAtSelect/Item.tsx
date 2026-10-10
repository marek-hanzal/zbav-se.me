import { DateTime } from "luxon";
import type { FC } from "react";
import { match } from "ts-pattern";
import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import type { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Typo } from "~/ui/ui/Typo";

export namespace Item {
	export interface Props {
		expire: ListingExpireEnumSchema.Type;
		isSelected: boolean;
		onChangeFn(value: ListingExpireEnumSchema.Type): void;
	}
}

export const Item: FC<Item.Props> = ({ expire, isSelected, onChangeFn }) => {
	return (
		<Button
			data-action={`select expiration ${expire}`}
			onClick={() => {
				onChangeFn(expire);
			}}
			{...uiSelectButtonFn({
				name: `ExpireAtSelect-[Button.${expire}]`,
				isSelected,
				"data-ui-flow": "horizontal",
				"data-ui-justify": "space-between",
			})}
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
