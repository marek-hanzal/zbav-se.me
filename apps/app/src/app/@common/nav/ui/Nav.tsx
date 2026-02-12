import { useLocale } from "@use-pico/client/hook";
import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { HomeIcon, ShopIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { uiNavButton } from "~/app/@common/nav/uiNavButton";

export namespace Nav {
	export interface Props extends Container.Props {
		//
	}
}

export const Nav: FC<Nav.Props> = ({ className, ...props }) => {
	const locale = useLocale();
	const activeUi: uiNavButton.Ui = {
		tone: "brand",
	};

	return (
		<Container
			data-ui="Nav[Container]"
			ui={{
				layout: "horizontal-flex",
				inner: "default",
				items: "center",
				justify: "space-evenly",
			}}
			{...props}
		>
			<LinkTo
				icon={HomeIcon}
				to="/$locale/flow/home"
				activeProps={{
					...uiNavButton({
						ui: activeUi,
						className: [],
					}),
				}}
				params={{
					locale,
				}}
				{...uiNavButton({
					className: [],
				})}
			/>

			<LinkTo
				icon={ShopIcon}
				to="/$locale/flow/shop"
				activeProps={{
					...uiNavButton({
						ui: activeUi,
						className: [],
					}),
				}}
				params={{
					locale,
				}}
				{...uiNavButton({
					className: [],
				})}
			/>

			<LinkTo
				icon={UserIcon}
				to="/$locale/flow/user"
				activeProps={{
					...uiNavButton({
						ui: activeUi,
						className: [],
					}),
				}}
				params={{
					locale,
				}}
				{...uiNavButton({
					className: [],
				})}
			/>
		</Container>
	);
};
