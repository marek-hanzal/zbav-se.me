import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace AgeValue {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				age: string;
			}>,
			"items" | "renderFn"
		> {
		feed: tFeed;
	}
}

export const AgeValue: FC<AgeValue.Props> = ({ feed, ...props }) => {
	const ageIn = feed.query?.filter?.ageIn;

	return (
		<ValueList
			data-ui={"AgeValue[ValueList]"}
			textLabel={translator.text("Feed age (label)")}
			textEmpty={translator.text("Feed age not selected")}
			textHint={translator.text("Feed age (hint)")}
			items={(ageIn ?? []).map((item) => ({
				id: String(item),
				age: String(item),
			}))}
			renderFn={(item) => (
				<Tx
					label={`Condition - Age [${item.age}] (hint)`}
					ui={{
						tone: "secondary",
					}}
				/>
			)}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			{...props}
		/>
	);
};
