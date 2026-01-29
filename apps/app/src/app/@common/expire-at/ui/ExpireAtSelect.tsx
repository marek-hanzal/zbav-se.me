import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tListingExpireEnum } from "@zbav-se.me/sdk/api/seller-user";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import { DateTime } from "luxon";
import { type FC, useId } from "react";
import { match } from "ts-pattern";

export namespace ExpireAtSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: tListingExpireEnum | undefined;
		onChange(value: tListingExpireEnum): void;
	}
}

export const ExpireAtSelect: FC<ExpireAtSelect.Props> = ({ value, onChange, ui, ...props }) => {
	const expireId = useId();

	return (
		<Container
			data-ui={"ExpireAtSelect[Container]"}
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(tListingExpireEnum).map((expire) => {
				return (
					<Button
						key={`${expireId}-${expire}`}
						onClick={() => {
							onChange(expire);
						}}
						{...uiSelectButton({
							isSelected: value === expire,
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
			})}
		</Container>
	);
};
