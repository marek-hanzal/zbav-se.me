import { createFileRoute } from "@tanstack/react-router";
import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ChevronLeftIcon, ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { withFavouriteCountQuery } from "@zbav-se.me/sdk/query/buyer-user/favourite";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, useRef } from "react";
import { ListingListContainer } from "~/app/@buyer-user/listing/ui/ListingListContainer";

export namespace EmptyFavourite {
	export interface Props extends Status.Props {
		//
	}
}

export const EmptyFavourite: FC<EmptyFavourite.Props> = ({ ...props }) => {
	const locale = useLocale();
	return (
		<Status
			icon={DeadEndIcon}
			textTitle={translator.text("No favourites yet (title)")}
			action={
				<>
					<LinkTo
						to={"/$locale/flow/buyer/feed/default"}
						icon={ChevronRightIcon}
						iconPosition={"right"}
						params={{
							locale,
						}}
						{...uiButton({
							ui: {
								width: "full",
								justify: "center",
							},
							className: [],
						})}
					>
						<Tx label={"Go to feed (link)"} />
					</LinkTo>

					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
						{...uiButton({
							ui: {
								tone: "link",
								theme: "light",
								width: "full",
								justify: "center",
							},
							className: [],
						})}
					>
						<Tx label={"Go to home (link)"} />
					</LinkTo>
				</>
			}
			ui={{
				tone: "brand",
				theme: "light",
			}}
			{...props}
		/>
	);
};

export namespace EmptyFeed {
	export interface Props extends Container.Props {
		//
	}
}

export const EmptyFeed: FC<EmptyFeed.Props> = ({ ...props }) => {
	const locale = useLocale();
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={translator.text("No listings in this favourites feed (title)")}
				textMessage={translator.text(
					"Try changing your feed or open all listings (message)",
				)}
				action={
					<Container
						ui={{
							flow: "vertical",
							height: "full",
							width: "full",
							gap: "xl",
						}}
					>
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/buyer/feed/default"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "xl",
									width: "full",
									size: "lg",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Go to feed (link)"} />
						</LinkTo>

						<LinkTo
							icon={ChevronLeftIcon}
							to={"/$locale/flow/buyer/favourite/list"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									width: "full",
									background: undefined,
									border: false,
									shadow: false,
									text: "default",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Back to favourites (link)"} />
						</LinkTo>
					</Container>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};

export namespace Appendix {
	export interface Props extends Container.Props {
		//
	}
}

export const Appendix: FC<Appendix.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={translator.text("That's all for now (title)")}
				textMessage={translator.text("No more listings to show (message)")}
				action={
					<Container
						ui={{
							flow: "vertical",
							height: "full",
							width: "full",
							gap: "xl",
						}}
					>
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/buyer/feed/default"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "xl",
									width: "full",
									size: "lg",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Go to feed (link)"} />
						</LinkTo>

						<LinkTo
							icon={ChevronLeftIcon}
							to={"/$locale/flow/buyer/favourite/list"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									width: "full",
									background: undefined,
									border: false,
									shadow: false,
									text: "default",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Back to favourites (link)"} />
						</LinkTo>
					</Container>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/favourite/list")({
	component() {
		const { id } = Route.useParams();
		const locale = useLocale();
		const containerRef = useRef<HTMLDivElement>(null);
		const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
			containerRef,
			threshold: 0.25,
		});

		return (
			<FlowContainer
				left={
					<LinkTo
						{...uiBackButton({
							ui: {
								opacity: isLast ? "full" : "low",
							},
							className: [],
						})}
						icon={ChevronLeftIcon}
						to={"/$locale/flow/buyer/favourite/list"}
						params={{
							locale,
						}}
						className={"transition-all"}
					/>
				}
			>
				<ListingListContainer
					ref={containerRef}
					feedId={id}
					/**
					 * Don't count score for listings in favourites
					 */
					withScore={false}
					scrollToId={undefined}
					query={{
						where: {
							feedId: id,
							isFavourite: true,
							withIgnored: false,
						},
						/**
						 * Cursor is hardcoded, so only first 200 listings are fetched.
						 */
						cursor: {
							page: 0,
							size: 200,
						},
						sort: [
							{
								field: "expiresAt",
								order: "desc",
							},
						],
					}}
					renderEmptyFn={() => {
						return (
							<withFavouriteCountQuery.Suspense
								data={{}}
								fallback={<SpinnerContainer />}
							>
								{({ data }) => {
									if (data.filter === 0) {
										return <EmptyFavourite ref={sentinelRef} />;
									}

									return <EmptyFeed ref={sentinelRef} />;
								}}
							</withFavouriteCountQuery.Suspense>
						);
					}}
					appendix={<Appendix ref={sentinelRef} />}
				/>
			</FlowContainer>
		);
	},
});
