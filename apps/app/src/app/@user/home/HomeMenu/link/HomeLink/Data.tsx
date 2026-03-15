import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { HomeIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ...props }) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"go home"}
			{...uiMenuButton({
				className: [],
			})}
			icon={HomeIcon}
			to="/$locale/home"
			params={{
				locale,
			}}
			{...props}
		>
			<TypoIcon
				flip
				icon={ChevronRightIcon}
				iconProps={{
					ui: {
						opacity: "5",
					},
				}}
			>
				<Tx label="Home (label)" />
			</TypoIcon>
		</LinkTo>
	);
};
