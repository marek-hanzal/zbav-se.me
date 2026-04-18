import { useMatchRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Container } from "@/lib/client/container";
import { Fade } from "@/lib/client/fade";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import type { uiIcon } from "@/lib/client/icon";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { AgentLink } from "~/user/home/HomeMenu/link/AgentLink";
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
		onLinkClick?(): void;
	}
}

/**
 * Builds the home navigation surface with links to key app destinations.
 * Use it as the main navigation entry inside user-facing hub screens.
 *
 * @see src/@user/home/page/HomePage.tsx
 */
export const HomeMenu = withFallback(({ _suspense, onLinkClick, ...props }: HomeMenu.Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const isHome = useMatchRoute()({
		to: "/$locale/app/home",
	});

	return (
		<Container
			data-ui="HomeMenu"
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
					<AgentLink
						_suspense={"I know"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
					/>
				</Group>

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
