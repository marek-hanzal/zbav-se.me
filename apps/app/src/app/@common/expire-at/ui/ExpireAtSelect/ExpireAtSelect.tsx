import { Container } from "@use-pico/client/ui/container";
import { tListingExpireEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
import { Item } from "./Item";

export namespace ExpireAtSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: tListingExpireEnum | undefined;
		onChange(value: tListingExpireEnum): void;
	}
}

export const ExpireAtSelect: FC<ExpireAtSelect.Props> = ({ value, onChange, ui, ...props }) => {
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
					<Item
						key={expire}
						expire={expire}
						isSelected={value === expire}
						onChange={onChange}
					/>
				);
			})}
		</Container>
	);
};
