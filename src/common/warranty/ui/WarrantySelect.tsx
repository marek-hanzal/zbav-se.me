import type { FC } from "react";
import { uiSelectButton } from "~/common/ui/ui";
import { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

export namespace WarrantySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting warranty values in forms.
 * Use it in editors where users need to choose or update warranty before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const WarrantySelect: FC<WarrantySelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="WarrantySelect[Container]"
			data-ui-layout="vertical-flex"
			data-ui-height="auto"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			{Object.values(WarrantyEnumSchema.enum).map((warranty) => {
				const item = {
					id: warranty,
				};
				const isSelected = selection.isSelected(warranty);

				return (
					<Button
						key={warranty}
						onClick={() => {
							selection.toggle(item);
						}}
						{...uiSelectButton({
							isSelected,
							"data-ui-flow": "horizontal",
							"data-ui-justify": "start",
						})}
						data-ui={`WarrantySelect-[Button.${warranty}]`}
					>
						<Tx label={`Listing warranty - ${warranty}`} />
					</Button>
				);
			})}
		</Container>
	);
};
