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
	MessageIcon,
	MyListingsIcon,
} from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";
import { HomeMenuDraftLinkSuspense } from "./HomeMenuDraftLinkSuspense";

export namespace HomeMenu {
	export interface Props extends Container.Props {
		//
	}
}

export const HomeMenu = ({ ui, ...props }: HomeMenu.Props) => {
	const locale = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const icon: uiIcon.Ui = {
		color: "icon",
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
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "md",
				}}
			>
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
						to="/$locale/flow/buyer/feed/default"
						params={{
							locale,
						}}
					>
						<TypoIcon
							flip
							icon={ChevronRightIcon}
							iconProps={{
								ui: {
									opacity: "xl",
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
						to="/$locale/flow/buyer/feed/default"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
								},
							}}
						>
							<Tx label="Find listings (label)" />
						</TypoIcon>
					</LinkTo>

					<HomeMenuDraftLinkSuspense icon={icon} />
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
						to="/$locale/flow/seller/message/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
						to="/$locale/flow/seller/listing/my"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
						to="/$locale/flow/seller/draft/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
						to="/$locale/flow/buyer/feed/select"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
						to="/$locale/flow/buyer/favourite/list"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
						to="/$locale/flow/user"
						params={{
							locale,
						}}
						activeProps={uiMenuButton({
							ui: {
								tone: "link",
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
									opacity: "xl",
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
