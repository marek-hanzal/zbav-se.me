import { useMatchRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { CartIcon, ChevronRightIcon, UserIcon, type uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import {
	DraftIcon,
	FavouriteIcon,
	FindListingsIcon,
	HomeIcon,
	MessageIcon,
	MyListingsIcon,
} from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";
import { HomeMenuDraftLink } from "./HomeMenuDraftLink";

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
	const locale = useLocale();
	const matchRoute = useMatchRoute();
	const containerRef = useRef<HTMLDivElement>(null);
	const icon: uiIcon.Ui = {
		color: "lead",
		text: "2xl",
	};

	// Keep this component in its original inline form until we define a type-safe split for TanStack Router links.
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
				{matchRoute({
					to: "/$locale/home",
				}) ? null : (
					<Group>
						<LinkTo
							{...uiMenuButton({
								className: [],
							})}
							icon={HomeIcon}
							iconProps={{
								ui: {
									...icon,
								},
							}}
							to="/$locale/home"
							params={{
								locale,
							}}
						>
							<TypoIcon
								flip
								icon={ChevronRightIcon}
								iconProps={{
									ui: {
										opacity: "5",
									},
								}}
							>
								<Tx label="Home (label)" />
							</TypoIcon>
						</LinkTo>
					</Group>
				)}

				<Group>
					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={CartIcon}
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
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="Listings (label)" />
						</TypoIcon>
					</LinkTo>

					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={FindListingsIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer/search"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="Find listings (label)" />
						</TypoIcon>
					</LinkTo>

					<HomeMenuDraftLink icon={icon} />
				</Group>

				<Group>
					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={MessageIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/seller/message/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="Messages (label)" />
						</TypoIcon>
					</LinkTo>
				</Group>

				<Group>
					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={MyListingsIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/seller/listing/my"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="My listings (label)" />
						</TypoIcon>
					</LinkTo>

					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={DraftIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/seller/draft/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label={"Draft list (label)"} />
						</TypoIcon>
					</LinkTo>
				</Group>

				<Group>
					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={"icon-[solar--archive-up-minimlistic-linear]"}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer/feed/select"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="Feed (label)" />
						</TypoIcon>
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
						to="/$locale/buyer/favourite/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="Favourites (label)" />
						</TypoIcon>
					</LinkTo>
				</Group>

				<Group>
					<LinkTo
						{...uiMenuButton({
							className: [],
						})}
						icon={UserIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/user"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "primary",
								theme: "light",
							},
							className: [],
						})}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "5",
								},
							}}
						>
							<Tx label="My profile (label)" />
						</TypoIcon>
					</LinkTo>
				</Group>
			</Container>
		</Container>
	);
};
