import { useLocale } from "@use-pico/client/hook";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { uiLinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace SearchButton {
	export interface Props extends uiLinkTo.Component<{}> {
		feedId: string;
	}
}

export const SearchButton: FC<SearchButton.Props> = ({ feedId, ui, className, ...props }) => {
	const locale = useLocale();

	return (
		<LinkTo
			to="/$locale/buyer/feed/$id/list"
			params={{
				locale,
				id: feedId,
			}}
			icon={SearchIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			{...uiLinkTo({
				ui: {
					tone: "neutral",
					theme: "light",
					size: "default",
					justify: "start",
					items: "center",
					background: "default",
					round: undefined,
					shadow: false,
					border: false,
					width: "full",
					...ui,
				},
				className,
			})}
			{...props}
		>
			<Tx label="Search (button)" />
		</LinkTo>
	);
};
