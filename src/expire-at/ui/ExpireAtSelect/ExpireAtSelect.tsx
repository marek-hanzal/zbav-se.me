import type { FC } from "react";
import { Item } from "~/expire-at/ui/ExpireAtSelect/Item";
import { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { Container } from "~/ui/ui/Container";

export namespace ExpireAtSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: ListingExpireEnumSchema.Type | undefined;
		onChangeFn(value: ListingExpireEnumSchema.Type): void;
	}
}

/**
 * Provides an interactive control for selecting expire at values in forms.
 * Use it in editors where users need to choose or update expire at before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ExpireAtSelect: FC<ExpireAtSelect.Props> = ({ value, onChangeFn, ...props }) => {
	return (
		<Container
			data-ui={"ExpireAtSelect[Container]"}
			data-ui-layout="vertical-flex"
			data-ui-height="auto"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			{Object.values(ListingExpireEnumSchema.enum).map((expire) => {
				return (
					<Item
						key={expire}
						expire={expire}
						isSelected={value === expire}
						onChangeFn={onChangeFn}
					/>
				);
			})}
		</Container>
	);
};
