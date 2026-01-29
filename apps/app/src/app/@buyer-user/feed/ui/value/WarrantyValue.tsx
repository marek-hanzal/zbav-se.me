import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";

export namespace WarrantyValue {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				warranty: string;
			}>,
			"items" | "renderFn"
		> {
		feed: tFeed;
	}
}

export const WarrantyValue: FC<WarrantyValue.Props> = ({ feed, ...props }) => {
	const warrantyIn = feed.query?.filter?.warrantyIn ?? [];

	return (
		<ValueList
			data-ui={"WarrantyValue[ValueList]"}
			textLabel={translator.text("Listing warranty (label)")}
			textEmpty={translator.text("Warranty not selected")}
			items={warrantyIn.map((item) => ({
				id: item,
				warranty: item,
			}))}
			renderFn={(item) => <Tx label={`Listing warranty - ${item.warranty}`} />}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			wrapperProps={{
				ui:
					warrantyIn.length > 0
						? {
								tone: "neutral",
								theme: "light",
							}
						: undefined,
			}}
			{...props}
		/>
	);
};
