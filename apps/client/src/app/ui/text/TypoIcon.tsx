import { Icon } from "@use-pico/client";
import type { FC, PropsWithChildren } from "react";

export namespace TypoIcon {
	export interface Props extends PropsWithChildren {
		icon: Icon.Type;
		iconProps?: Icon.Props;
	}
}

export const TypoIcon: FC<TypoIcon.Props> = ({ icon, iconProps, children }) => {
	return (
		<div className="inline-flex flex-row gap-2 items-start">
			<Icon
				icon={icon}
				{...iconProps}
			/>
			<div className="flex flex-col gap-1 items-start">{children}</div>
		</div>
	);
};
