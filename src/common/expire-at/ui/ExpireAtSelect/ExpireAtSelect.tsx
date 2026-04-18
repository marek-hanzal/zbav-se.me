import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { Item } from "./Item";

export namespace ExpireAtSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: ListingExpireEnumSchema.Type | undefined;
		onChange(value: ListingExpireEnumSchema.Type): void;
	}
}

/**
 * Provides an interactive control for selecting expire at values in forms.
 * Use it in editors where users need to choose or update expire at before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ExpireAtSelect: FC<ExpireAtSelect.Props> = ({ value, onChange, ...props }) => {
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
			{Object.values(ListingExpireEnumSchema.enum).map((expire) => {
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
