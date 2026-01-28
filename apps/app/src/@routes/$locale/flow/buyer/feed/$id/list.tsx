import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useLocale, useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from "@use-pico/client/icon";
import { Button, uiButton } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, FirstIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, type RefObject, useRef, useState } from "react";
import z from "zod";
import { SetupButton as CoolSetupButton } from "~/app/feed/ui/button/SetupButton";
import { SetupSheet } from "~/app/feed/ui/SetupSheet";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";

export namespace SetupButton {
	export interface Props extends Partial<CoolSetupButton.Props> {
		feed: tFeed;
		containerRef: RefObject<HTMLDivElement | null>;
		state: StateType.State<boolean>;
	}
}

export const SetupButton: FC<SetupButton.Props> = ({ feed, containerRef, state, ui, ...props }) => {
	return (
		<CoolSetupButton
			data-ui={"/buyer/feed/$id/list-[FeedSetupButton]"}
			state={state}
			feed={feed}
			defaultOpen={false}
			label={null}
			ui={{
				tone: "secondary",
				theme: "light",
				justify: "center",
				items: "center",
				square: "default",
				zIndex: true,
				round: "full",
				snapTo: "top-right",
				text: "xl",
				opacity: "low",
				...ui,
			}}
			{...props}
		/>
	);
};

export namespace Appendix {
	export interface Props extends Container.Props {
		feed: tFeed;
		containerRef: RefObject<HTMLDivElement | null>;
		state: StateType.State<boolean>;
	}
}

export const Appendix: FC<Appendix.Props> = ({ feed, containerRef, state, ui, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={"That's all for now (title)"}
				textMessage={"That's all for now (message)"}
				action={
					<>
						<SetupButton
							feed={feed}
							containerRef={containerRef}
							state={state}
							label={translator.text("Adjust feed (button)")}
							iconProps={{
								ui: {
									text: "xl",
								},
							}}
							ui={{
								tone: "secondary",
								theme: "light",
								snapTo: undefined,
								justify: "center",
								round: "default",
								text: "default",
								size: "default",
								width: "full",
								font: "semibold",
								square: undefined,
							}}
						/>

						<LinkTo
							icon={ArrowRightIcon}
							iconPosition={"right"}
							iconProps={{
								ui: {
									text: "xl",
								},
							}}
							to={"/$locale/ui/buyer"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "default",
									size: "default",
									justify: "center",
									width: "full",
									background: undefined,
									border: false,
									shadow: false,
								},
								className: [],
							})}
						>
							<Tx label="Back to home (link)" />
						</LinkTo>
					</>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={[
					"text-center",
				]}
			/>
		</Container>
	);
};

export namespace FeedEmpty {
	export interface Props extends Container.Props {
		feed: tFeed;
		containerRef: RefObject<HTMLDivElement | null>;
		state: StateType.State<boolean>;
	}
}

export const FeedEmpty: FC<FeedEmpty.Props> = ({ feed, containerRef, state, ui, ...props }) => {
	const locale = useLocale();
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={"No listings in feed (title)"}
				textMessage={"No listings in feed (message)"}
				action={
					<>
						<SetupButton
							feed={feed}
							containerRef={containerRef}
							state={state}
							label={translator.text("Adjust feed (button)")}
							iconProps={{
								ui: {
									text: "xl",
								},
							}}
							ui={{
								tone: "secondary",
								theme: "light",
								snapTo: undefined,
								justify: "center",
								round: "default",
								text: "default",
								size: "default",
								width: "full",
								font: "semibold",
								square: undefined,
							}}
						/>

						<LinkTo
							icon={ArrowLeftIcon}
							iconPosition={"left"}
							iconProps={{
								ui: {
									text: "xl",
								},
							}}
							to={"/$locale/ui/buyer"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "default",
									size: "default",
									justify: "center",
									width: "full",
									background: undefined,
									border: false,
									shadow: false,
								},
								className: [],
							})}
						>
							<Tx label="Back to home (link)" />
						</LinkTo>
					</>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={[
					"text-center",
				]}
			/>
		</Container>
	);
};

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/list")({
	validateSearch: z.object({
		/**
		 * If needed, we can restore scroll position to a particular listing
		 */
		scrollToId: z.string().optional(),
	}),
	async loader({ context: { queryClient }, params: { id } }) {
		/**
		 * This will force update "updatedAt" field, so we'll mark "this" feed as the "last visited" one.
		 */
		const feed = await withFeedPatchMutation.mutate(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});

		return {
			feed,
		};
	},
	/**
	 * We've loader, so we also need pending component.
	 */
	pendingComponent() {
		return (
			<FlowContainer>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const router = useRouter();
		const { scrollToId } = Route.useSearch();
		const containerRef = useRef<HTMLDivElement>(null);
		const [isFeedSettings, setIsFeedSettings] = useState(false);
		const { feed } = Route.useLoaderData();

		/**
		 * The trick - fetch _any_ listing, so we know, if the app is empty.
		 *
		 * Using collection, because "fetch" throws error on 4o4.
		 */
		const { data: listing } = withListingCollectionQuery.useSuspenseQuery({
			cursor: {
				page: 0,
				size: 1,
			},
		});

		const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
			containerRef,
			threshold: 0.25,
		});

		return (
			<FlowContainer
				data-ui={"/buyer/feed/$id/list[FlowContainer]"}
				left={
					<LinkTo
						{...uiBackButton({
							ui: {
								opacity: isLast ? "full" : "low",
							},
							className: [],
						})}
						data-ui={"/buyer/feed/$id/list-[LinkTo.left]"}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/buyer"}
						params={{
							locale,
						}}
						className={"transition-all"}
					/>
				}
			>
				{listing.data.length > 0 ? (
					<>
						<SetupButton
							feed={feed}
							containerRef={containerRef}
							state={{
								value: isFeedSettings,
								set: setIsFeedSettings,
							}}
							ui={{
								opacity: isLast ? "full" : "low",
							}}
							className={"transition-all"}
						/>

						<ListingListContainer
							data-ui={"/buyer/feed/$id/list-[ListingListContainer]"}
							ref={containerRef}
							feedId={feed.id}
							/**
							 * Listings in feed should be scored
							 */
							withScore
							query={{
								...feed.query,
								sort: feed.query.sort?.length
									? feed.query.sort
									: [
											{
												field: "createdAt",
												direction: "desc",
											},
										],
								meta: {
									feedId: feed.id,
									...feed.query.meta,
								},
								/**
								 * Hardcoded cursor to fetch the first page; we're assuming an user won't go through
								 * thousands of listings, so we can do hard cap here.
								 */
								cursor: {
									page: 0,
									size: 256,
								},
							}}
							scrollToId={scrollToId}
							renderEmptyFn={() => (
								<FeedEmpty
									ref={sentinelRef}
									feed={feed}
									containerRef={containerRef}
									state={{
										value: isFeedSettings,
										set: setIsFeedSettings,
									}}
								/>
							)}
							appendix={
								<Appendix
									ref={sentinelRef}
									feed={feed}
									containerRef={containerRef}
									state={{
										value: isFeedSettings,
										set: setIsFeedSettings,
									}}
								/>
							}
						/>
					</>
				) : null}

				{listing.data.length > 0 ? null : (
					<Container
						ui={{
							layout: "vertical-centered",
							height: "full",
							tone: "brand",
							theme: "light",
							inner: "4xl",
						}}
					>
						<Status
							icon={FirstIcon}
							iconProps={{
								ui: {
									text: "4xl",
								},
							}}
							textTitle={"First listing (title)"}
							textMessage={"First listing (message)"}
							messageProps={{
								className: "text-center",
							}}
							action={
								<>
									<LinkTo
										icon={ArrowRightIcon}
										iconPosition={"right"}
										to={"/$locale/ui/seller/draft/resolve"}
										params={{
											locale,
										}}
										{...uiButton({
											ui: {
												tone: "brand",
												theme: "light",
												text: "lg",
												size: "default",
												font: "bold",
											},
											className: [],
										})}
									>
										<Tx label="Create first listing (button)" />
									</LinkTo>

									<LinkTo
										icon={ArrowRightIcon}
										iconPosition={"right"}
										to={"/$locale/ui/home"}
										params={{
											locale,
										}}
										{...uiButton({
											ui: {
												tone: "link",
												theme: "light",
												text: "sm",
												size: "sm",
												background: undefined,
												border: false,
												shadow: false,
											},
											className: [],
										})}
									>
										<Tx label="First listing - go home (button)" />
									</LinkTo>
								</>
							}
						/>
					</Container>
				)}

				<withFeedFetchQuery.Suspense
					data={{
						where: {
							id: feed.id,
						},
					}}
					fallback={null}
				>
					{({ data: feed }) => {
						return (
							<SetupSheet
								data-ui={"/buyer/feed/$id/list-[FeedSetupSheet]"}
								feed={feed}
								state={{
									value: isFeedSettings,
									set: setIsFeedSettings,
								}}
								noDelete
							>
								<Button
									onClick={() => {
										setIsFeedSettings(false);
										setTimeout(() => router.invalidate(), 200);
									}}
									iconEnabled={RefreshIcon}
									iconProps={{
										ui: {
											text: "xl",
										},
									}}
									label={"Refresh feed (button)"}
									ui={{
										tone: "neutral",
										theme: "light",
										size: "default",
										justify: "start",
										items: "center",
										background: "default",
										shadow: true,
										border: true,
									}}
								/>
							</SetupSheet>
						);
					}}
				</withFeedFetchQuery.Suspense>
			</FlowContainer>
		);
	},
});
