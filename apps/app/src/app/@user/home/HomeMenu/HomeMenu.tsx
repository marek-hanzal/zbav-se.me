import { useMatchRoute } from "@tanstack/react-router";
import type { uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Group } from "@use-pico/client/ui/group";
import { useRef } from "react";
import { DraftLink } from "./link/DraftLink/DraftLink";
import { DraftListLink } from "./link/DraftListLink/DraftListLink";
import { FavouritesLink } from "./link/FavouritesLink/FavouritesLink";
import { FeedLink } from "./link/FeedLink/FeedLink";
import { HomeLink } from "./link/HomeLink/HomeLink";
import { ListingsLink } from "./link/ListingsLink/ListingsLink";
import { MessageLink } from "./link/MessageLink/MessageLink";
import { MyListingsLink } from "./link/MyListingsLink/MyListingsLink";
import { NotificationLink } from "./link/NotificationLink/NotificationLink";
import { ProfileLink } from "./link/ProfileLink/ProfileLink";
import { SearchLink } from "./link/SearchLink/SearchLink";

const icon: uiIcon.Ui = {
	color: "lead",
	text: "2xl",
};

export namespace HomeMenu {
	export interface Props extends Container.Props {
		//
	}
}

/**
 * Builds the home navigation surface with links to key app destinations.
 * Use it as the main navigation entry inside user-facing hub screens.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomeMenu = ({ ui, ...props }: HomeMenu.Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const isHome = useMatchRoute()({
		to: "/$locale/home",
	});

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
				data-ui={"HomeMenu-[Content]"}
				ref={containerRef}
				className={"min-h-0"}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "md",
				}}
			>
				{isHome ? null : (
					<Group>
						<HomeLink
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Group>
				)}

				<Group>
					<ListingsLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<SearchLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<DraftLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<NotificationLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<MessageLink
					iconProps={{
						ui: {
							...icon,
						},
					}}
				/>

				<Group>
					<MyListingsLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<DraftListLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<FeedLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<FavouritesLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<ProfileLink
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>
			</Container>
		</Container>
	);
};
