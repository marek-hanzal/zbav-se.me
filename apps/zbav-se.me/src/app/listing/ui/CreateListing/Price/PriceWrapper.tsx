import { Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export namespace PriceWrapper {
	export interface Props {
		subtitleVariant?: Cls.VariantsOf<TitleCls>;
	}
}

export const PriceWrapper: FC<PriceWrapper.Props> = ({
	subtitleVariant = {
		tone: "secondary",
		size: "lg",
	},
}) => {
	return (
		<Sheet>
			<Title
				icon={PriceIcon}
				tone={"secondary"}
				theme={"dark"}
				{...subtitleVariant}
			>
				<Tx label={"Price (title)"} />
			</Title>
		</Sheet>
	);
};
