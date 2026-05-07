import { useMatchRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Container } from "@/lib/client/container";
import { Fade } from "@/lib/client/fade";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import type { uiIcon } from "@/lib/client/icon";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
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
			data-ui-position="relative"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				className={"min-h-0"}
				data-ui-layout="vertical-flex"
				data-ui-scroll="vertical"
				data-ui-height="full"
				data-ui-inner="default"
				data-ui-items="center"
				data-ui-gap="lg"
			>
				{isHome ? null : (
					<Group>
						<HomeLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>
				)}

				<Tx
					label="Home - interaction (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
					data-ui-width={"full"}
				>
					<Group>
						<AgentLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>

					<Group>
						<NotificationLink
							_suspense={"I know"}
							onLinkClick={onLinkClick}
							iconProps={icon}
						/>
					</Group>
				</Container>

				<Tx
					label="Home - quick tools (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
					data-ui-width={"full"}
				>
					<Group>
						<ListingsLink
							_suspense={"I know"}
							iconProps={icon}
						/>
						<DraftLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>

					<Group>
						<SearchLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>
				</Container>

				<Tx
					label="Home - seller stuff (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Group>
					<MyListingsLink
						_suspense={"I know"}
						iconProps={icon}
					/>
					<DraftListLink
						_suspense={"I know"}
						iconProps={icon}
					/>
				</Group>

				<Tx
					label="Home - buyer stuff (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
					data-ui-width={"full"}
				>
					<Group>
						<FeedLink
							_suspense={"I know"}
							iconProps={icon}
						/>
						<FavouritesLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>
				</Container>

				<Tx
					label="Home - misc (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
					data-ui-width={"full"}
				>
					<MessageLink
						_suspense={"I know"}
						iconProps={icon}
					/>

					<Group>
						<ProfileLink
							_suspense={"I know"}
							iconProps={icon}
						/>
					</Group>
				</Container>
			</Container>
		</Container>
	);
}, SpinnerContainer);
