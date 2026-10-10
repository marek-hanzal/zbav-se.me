import { useMatchRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { uiIcon } from "~/ui/fn/uiIcon";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Fade } from "~/ui/ui/Fade";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import type { Typo } from "~/ui/ui/Typo";
import { AgentLink } from "~/user-home/ui/HomeMenu/AgentLink.exports";
import { DraftLink } from "~/user-home/ui/HomeMenu/DraftLink.exports";
import { DraftListLink } from "~/user-home/ui/HomeMenu/DraftListLink.exports";
import { FavouritesLink } from "~/user-home/ui/HomeMenu/FavouritesLink.exports";
import { FeedLink } from "~/user-home/ui/HomeMenu/FeedLink.exports";
import { HomeLink } from "~/user-home/ui/HomeMenu/HomeLink.exports";
import { ListingsLink } from "~/user-home/ui/HomeMenu/ListingsLink.exports";
import { MessageLink } from "~/user-home/ui/HomeMenu/MessageLink.exports";
import { MyListingsLink } from "~/user-home/ui/HomeMenu/MyListingsLink.exports";
import { NotificationLink } from "~/user-home/ui/HomeMenu/NotificationLink.exports";
import { ProfileLink } from "~/user-home/ui/HomeMenu/ProfileLink.exports";
import { SearchLink } from "~/user-home/ui/HomeMenu/SearchLink.exports";

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
 */
export const HomeMenu = withFallback(({ _suspense, onLinkClick, ...props }: HomeMenu.Props) => {
	const translator = useTranslator();
	const containerRef = useRef<HTMLDivElement>(null);
	const isHome = useMatchRoute()({
		to: "/$locale/app/home",
	});

	const miniLabel: Typo.PropsEx = {
		"data-ui-opacity": "7",
	};

	return (
		<Container
			data-ui="HomeMenu[Container]"
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
				<Group>
					<LabelValue
						textLabel={translator.text("Home - interaction (title)")}
						textLabelProps={miniLabel}
						textValue={
							<Container
								data-ui-flow={"vertical"}
								data-ui-gap={"default"}
								data-ui-width={"full"}
							>
								<Group data-ui-shadow={false}>
									<AgentLink
										_suspense={"I know"}
										iconProps={icon}
									/>

									<NotificationLink
										_suspense={"I know"}
										onLinkClick={onLinkClick}
										iconProps={icon}
									/>
								</Group>
							</Container>
						}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Home - quick tools (title)")}
						textLabelProps={miniLabel}
						textValue={
							<Container
								data-ui-flow={"vertical"}
								data-ui-gap={"default"}
								data-ui-width={"full"}
							>
								<Group data-ui-shadow={false}>
									<ListingsLink
										_suspense={"I know"}
										iconProps={icon}
									/>

									<DraftLink
										_suspense={"I know"}
										iconProps={icon}
									/>

									<SearchLink
										_suspense={"I know"}
										iconProps={icon}
									/>
								</Group>
							</Container>
						}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Home - seller stuff (title)")}
						textLabelProps={miniLabel}
						textValue={
							<Group data-ui-shadow={false}>
								<MyListingsLink
									_suspense={"I know"}
									iconProps={icon}
								/>
								<DraftListLink
									_suspense={"I know"}
									iconProps={icon}
								/>
							</Group>
						}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Home - buyer stuff (title)")}
						textLabelProps={miniLabel}
						textValue={
							<Container
								data-ui-flow={"vertical"}
								data-ui-gap={"default"}
								data-ui-width={"full"}
							>
								<Group data-ui-shadow={false}>
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
						}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Home - misc (title)")}
						textLabelProps={miniLabel}
						textValue={
							<Container
								data-ui-flow={"vertical"}
								data-ui-gap={"default"}
								data-ui-width={"full"}
							>
								<Group data-ui-shadow={false}>
									<MessageLink
										_suspense={"I know"}
										iconProps={icon}
										data-ui-shadow={false}
									/>

									<ProfileLink
										_suspense={"I know"}
										iconProps={icon}
									/>
								</Group>
							</Container>
						}
					/>
				</Group>
			</Container>
		</Container>
	);
}, SpinnerContainer);
