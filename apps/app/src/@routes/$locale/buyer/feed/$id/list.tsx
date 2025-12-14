import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button, uiButton } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { DeadEndIcon, ListingIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { type FC, type RefObject, useRef, useState } from "react";
import z from "zod";
import { SetupButton as CoolSetupButton } from "~/app/feed/ui/button/SetupButton";
import { ListingListContainer } from "~/app/listing/ui/ListingListContainer";

export namespace SetupButton {
	export interface Props extends Partial<CoolSetupButton.Props> {
		locale: string;
		feed: tFeed;
		containerRef: RefObject<HTMLDivElement | null>;
	}
}

export const SetupButton: FC<SetupButton.Props> = ({
	locale,
	feed,
	containerRef,
	ui,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<CoolSetupButton
			data-ui={"/buyer/feed/$id/list-[FeedSetupButton]"}
			locale={locale}
			state={{
				value: isOpen,
				set: setIsOpen,
			}}
			feed={feed}
			defaultOpen={false}
			noDelete={true}
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
		>
			<LinkTo
				to={"/$locale/buyer/feed/$id/list"}
				icon={ListingIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				params={{
					locale,
					id: feed.id,
				}}
				resetScroll
				onClick={() => {
					setIsOpen(false);
					containerRef.current?.scrollTo({
						top: 0,
						behavior: "instant",
					});
				}}
				{...uiButton({
					ui: {
						tone: "secondary",
						theme: "light",
						size: "default",
						text: "lg",
					},
					className: [],
				})}
				data-ui={"/buyer/feed/$id/list-[LinkTo.refresh]"}
			>
				<Tx label="Refresh listings (button)" />
			</LinkTo>
		</CoolSetupButton>
	);
};

export namespace Appendix {
	export interface Props {
		locale: string;
		feed: tFeed;
		containerRef: RefObject<HTMLDivElement | null>;
	}
}

export const Appendix: FC<Appendix.Props> = ({ locale, feed, containerRef }) => {
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={"That's all for now (title)"}
				action={
					<>
						<SetupButton
							locale={locale}
							feed={feed}
							containerRef={containerRef}
							label={"ddd"}
							ui={{
								snapTo: undefined,
								round: "default",
								width: "content",
							}}
						/>

						<LinkTo
							to={"/$locale/ui/buyer"}
							params={{
								locale,
							}}
						>
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								label={"Back to home (link)"}
								ui={{
									size: "xl",
									justify: "start",
								}}
							/>
						</LinkTo>
					</>
				}
			/>
		</Container>
	);
};

export const Route = createFileRoute("/$locale/buyer/feed/$id/list")({
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
		await withFeedPatchMutation.mutate(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});
	},
	/**
	 * We've loader, so we also need pending component.
	 */
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
	component() {
		const { id, locale } = Route.useParams();
		const { scrollToId } = Route.useSearch();
		const containerRef = useRef<HTMLDivElement>(null);

		return (
			<FlowContainer
				data-ui={"/buyer/feed/$id/list[FlowContainer]"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						data-ui={"/buyer/feed/$id/list-[LinkTo.left]"}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<withFeedFetchQuery.Suspense
					data={{
						where: {
							id,
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data: feed }) => {
						return (
							<>
								<SetupButton
									locale={locale}
									feed={feed}
									containerRef={containerRef}
								/>

								<ListingListContainer
									data-ui={"/buyer/feed/$id/list-[ListingListContainer]"}
									ref={containerRef}
									locale={locale}
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
									appendix={
										<Appendix
											locale={locale}
											feed={feed}
											containerRef={containerRef}
										/>
									}
								/>
							</>
						);
					}}
				</withFeedFetchQuery.Suspense>
			</FlowContainer>
		);
	},
});
