import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace ConsLabel {
	export interface Props {
		draft: tDraft;
		onClick(): void;
	}
}

export const ConsLabel: FC<ConsLabel.Props> = ({ draft, onClick }) => {
	const consItems = (draft.cons ?? []).map((con, index) => ({
		id: String(index),
		con,
	}));

	return (
		<ValueList
			data-ui={"ConsLabel[ValueList]"}
			textLabel={translator.text("Listing - Cons (label)")}
			textEmpty={translator.text("Listing - Cons not filled")}
			items={consItems}
			renderFn={(item) => <Tx label={item.con} />}
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
					tone: consItems.length > 0 ? "neutral" : "secondary",
				},
			}}
		/>
	);
};
