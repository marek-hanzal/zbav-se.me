import { Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export namespace ConditionWrapper {
	export interface Props {
		subtitleVariant?: Cls.VariantsOf<TitleCls>;
	}
}

export const ConditionWrapper: FC<ConditionWrapper.Props> = ({
	subtitleVariant = {
		tone: "secondary",
		size: "lg",
	},
}) => {
	return (
		<Sheet>
			<Title
				icon={ConditionIcon}
				tone={"secondary"}
				theme={"dark"}
				{...subtitleVariant}
			>
				<Tx label={"Condition (title)"} />
			</Title>
		</Sheet>
	);
};
