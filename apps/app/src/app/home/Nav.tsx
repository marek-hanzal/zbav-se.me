import { UserIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BuyerIcon, HomeIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { uiNavButton } from "~/app/home/uiNavButton";

export namespace Nav {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const Nav: FC<Nav.Props> = ({ locale, ...props }) => {
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
				to="/$locale/home"
				activeOptions={{
					exact: true,
				}}
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
				icon={SellerIcon}
				to="/$locale/home/seller"
				activeOptions={{
					exact: true,
				}}
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
				icon={BuyerIcon}
				to="/$locale/home/buyer"
				activeOptions={{
					exact: true,
				}}
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
				to="/$locale/home/user"
				activeOptions={{
					exact: true,
				}}
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
