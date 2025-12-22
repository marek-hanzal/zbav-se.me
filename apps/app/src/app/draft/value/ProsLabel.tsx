import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace ProsLabel {
	export interface Props {
		draft: tDraft;
		onClick(): void;
	}
}

export const ProsLabel: FC<ProsLabel.Props> = ({ draft, onClick }) => {
	const prosItems = (draft.pros ?? []).map((pro, index) => ({
		id: String(index),
		pro,
	}));

	return (
		<ValueList
			data-ui={"ProsLabel[ValueList]"}
			textLabel={translator.text("Listing - Pros (label)")}
			textEmpty={translator.text("Listing - Pros not filled")}
			items={prosItems}
			renderFn={(item) => <Tx label={item.pro} />}
			action={
				<Icon
					icon={EditIcon}
					onClick={onClick}
					ui={{
						text: "xl",
					}}
				/>
			}
			onClick={onClick}
			wrapperProps={{
				ui: {
					tone: prosItems.length > 0 ? "neutral" : "secondary",
				},
			}}
		/>
	);
};
