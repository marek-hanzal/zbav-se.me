import { useLocale } from "@use-pico/client/hook";
import type { uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { FavouriteIcon, FeedIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";

export namespace HomeMenu {
	export interface Props extends Container.Props {
		//
	}
}

export const HomeMenu = ({ ui, ...props }: HomeMenu.Props) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const icon: uiIcon.Ui = {
		text: "3xl",
	};

	return (
		<Container
			data-ui="HomeMenu[Container]"
			ui={{
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				data-ui={"HomeMenu-Content[Container]"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "lg",
				}}
			>
				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ListingIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/buyer/feed/default"
					params={{
						locale,
					}}
				>
					<Tx label="Listings (label)" />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={FeedIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/buyer/feed/select"
					params={{
						locale,
					}}
				>
					<Tx label="Feed (label)" />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={FavouriteIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/buyer/favourite/list"
					params={{
						locale,
					}}
				>
					<Tx label="Favourites (label)" />
				</LinkTo>
			</Container>
		</Container>
	);
};
