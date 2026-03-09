import { useLocale } from "@use-pico/client/hook";
import { uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace SearchButton {
	export interface Props extends uiButton.Component<{}> {
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
			{...uiButton({
				ui: {
					tone: "primary",
					theme: "light",
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
