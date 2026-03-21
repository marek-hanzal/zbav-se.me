import { useMatchRoute } from "@tanstack/react-router";
import type { uiIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Group } from "@use-pico/client/ui/group";
import { withFallback } from "@use-pico/client/utils";
import { useRef } from "react";
import { DraftLink } from "./link/DraftLink";
import { DraftListLink } from "./link/DraftListLink";
import { FavouritesLink } from "./link/FavouritesLink";
import { FeedLink } from "./link/FeedLink";
import { HomeLink } from "./link/HomeLink";
import { ListingsLink } from "./link/ListingsLink";
import { MessageLink } from "./link/MessageLink";
import { MyListingsLink } from "./link/MyListingsLink";
import { NotificationLink } from "./link/NotificationLink";
import { ProfileLink } from "./link/ProfileLink";
import { SearchLink } from "./link/SearchLink";

const icon: uiIcon.Ui = {
	color: "lead",
	text: "2xl",
};

export namespace HomeMenu {
	export interface Props extends Container.Props, MarkSuspense.Props {
		onLinkClick?: () => void;
	}
}

/**
 * Builds the home navigation surface with links to key app destinations.
 * Use it as the main navigation entry inside user-facing hub screens.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomeMenu = withFallback(({ _suspense, ui, onLinkClick, ...props }: HomeMenu.Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const isHome = useMatchRoute()({
		to: "/$locale/app/home",
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
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Group>
				)}

				<Group>
					<NotificationLink
						_suspense={"I know"}
						onLinkClick={onLinkClick}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<SearchLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<ListingsLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<DraftLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<MyListingsLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<DraftListLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<Group>
					<FeedLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
					<FavouritesLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

				<MessageLink
					_suspense={"I know"}
					iconProps={{
						ui: {
							...icon,
						},
					}}
				/>

				<Group>
					<ProfileLink
						_suspense={"I know"}
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
}, SpinnerContainer);
