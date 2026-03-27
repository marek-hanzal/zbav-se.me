import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import { DateTime } from "luxon";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";

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
				ui: {
					flow: "horizontal",
					justify: "space-between",
				},
				className: [],
			})}
			data-ui={`ExpireAtSelect-[Button.${expire}]`}
		>
			<Tx
				label={`Expire in ${expire}`}
				ui={{
					font: "bold",
				}}
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
				ui={{
					text: "md",
				}}
			/>
		</Button>
	);
};
