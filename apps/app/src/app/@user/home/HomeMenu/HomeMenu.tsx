import { useMatchRoute } from "@tanstack/react-router";
import type { uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Group } from "@use-pico/client/ui/group";
import { Suspense, useRef } from "react";
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
	export interface Props extends Container.Props {
		onLinkClick?: () => void;
	}
}

/**
 * Builds the home navigation surface with links to key app destinations.
 * Use it as the main navigation entry inside user-facing hub screens.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomeMenu = ({ ui, onLinkClick, ...props }: HomeMenu.Props) => {
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
						<Suspense
							fallback={
								<HomeLink.Fallback
									iconProps={{
										ui: {
											...icon,
										},
									}}
								/>
							}
						>
							<HomeLink
								_suspense={"I know"}
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						</Suspense>
					</Group>
				)}

				<Group>
					<Suspense
						fallback={
							<NotificationLink.Fallback
								onLinkClick={onLinkClick}
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<NotificationLink
							_suspense={"I know"}
							onLinkClick={onLinkClick}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>

				<Group>
					<Suspense
						fallback={
							<SearchLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<SearchLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>

				<Group>
					<Suspense
						fallback={
							<ListingsLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<ListingsLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
					<Suspense
						fallback={
							<DraftLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<DraftLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>

				<Group>
					<Suspense
						fallback={
							<MyListingsLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<MyListingsLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
					<Suspense
						fallback={
							<DraftListLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<DraftListLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>

				<Group>
					<Suspense
						fallback={
							<FeedLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<FeedLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
					<Suspense
						fallback={
							<FavouritesLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<FavouritesLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>

				<Suspense
					fallback={
						<MessageLink.Fallback
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					}
				>
					<MessageLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Suspense>

				<Group>
					<Suspense
						fallback={
							<ProfileLink.Fallback
								iconProps={{
									ui: {
										...icon,
									},
								}}
							/>
						}
					>
						<ProfileLink
							_suspense={"I know"}
							iconProps={{
								ui: {
									...icon,
								},
							}}
						/>
					</Suspense>
				</Group>
			</Container>
		</Container>
	);
};
