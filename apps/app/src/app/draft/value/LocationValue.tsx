import { EditIcon, Icon } from "@use-pico/client/icon";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { LocationValue as BaseLocationValue } from "~/app/location/ui/LocationValue";

export namespace LocationValue {
	export interface Props extends Omit<BaseLocationValue.Props, "locationId"> {
		draft: tDraft;
	}
}

export const LocationValue: FC<LocationValue.Props> = ({ draft, ...props }) => {
	return (
		<BaseLocationValue
			data-ui={"LocationValue[LocationValue]"}
			wrapperProps={{
				ui: {
					tone: draft.locationId ? "neutral" : "primary",
				},
			}}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			textLabel={translator.text("Listing location (label)")}
			textEmpty={translator.text("Listing location not selected")}
			textHint={translator.text("Listing location (hint)")}
			locationId={draft.locationId}
			{...props}
		/>
	);
};
