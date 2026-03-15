import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { DraftIcon } from "@zbav-se.me/ui/icon";
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
			data-action={"open draft list"}
			{...uiMenuButton({
				className: [],
			})}
			icon={DraftIcon}
			to="/$locale/seller/draft/list"
			params={{
				locale,
			}}
			activeProps={uiMenuButton({
				ui: {
					tone: "primary",
					theme: "light",
				},
				className: [],
			})}
			{...uiMenuButton({
				ui: {
					tone: "neutral",
					theme: "light",
				},
				className: [],
			})}
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
				<Tx label={"Draft list (label)"} />
			</TypoIcon>
		</LinkTo>
	);
};
