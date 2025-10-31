import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Badge,
	type BadgeCls,
	Button,
	Container,
	LinkTo,
	SpinnerIcon,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { type Cls, VariantProvider } from "@use-pico/cls";
import type { tFeedCreate, tFeedPatch } from "@zbav-se.me/sdk";
import { SendPackageIcon, ThemeCls, TitleContainer } from "@zbav-se.me/ui";
import { withCategoryCollectionQuery } from "~/app/category/query/withCategoryCollectionQuery";
import { withFeedCreateMutation } from "~/app/feed/mutation/withFeedCreateMutation";
import { withFeedPatchMutation } from "~/app/feed/mutation/withFeedPatchMutation";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/submit")({
	validateSearch: FeedWizardSchema,
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<TitleContainer
				textTitle={"Feed submit (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/name"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<Status icon={SpinnerIcon} />
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		const locationFetchQuery = withLocationFetchQuery().useSuspenseQuery(
			{
				where: {
					id: state.locationId,
				},
			},
			{
				enabled: !!state.locationId,
			},
		);

		const categoryCollectionQuery =
			withCategoryCollectionQuery.useSuspenseQuery(
				{
					where: {
						idIn: state.filter?.categoryIdIn,
					},
				},
				{
					enabled: !!state.filter?.categoryIdIn?.length,
				},
			);

		const feedCreateMutation = withFeedCreateMutation.useMutation({
			async onPostMutation({ result }) {
				return navigate({
					to: "/$locale/buyer/feed/select",
					params: {
						locale,
					},
					search: {
						feedId: result.id,
					},
				});
			},
		});

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation({ result }) {
				return navigate({
					to: "/$locale/buyer/feed/select",
					params: {
						locale,
					},
					search: {
						feedId: result.id,
					},
				});
			},
		});

		const isLoading =
			feedCreateMutation.isPending || feedPatchMutation.isPending;

		const badgeTweak: Cls.TweaksOf<BadgeCls> = {
			slot: {
				root: {
					class: [
						"flex",
						"flex-col",
						"items-start",
						"h-fit",
						"w-full",
					],
					token: [
						"round.md",
						"square.md",
					],
				},
			},
		};

		return (
			<TitleContainer
				textTitle={"Feed submit (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/name"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<Button
						iconEnabled={SendPackageIcon}
						label={"Submit - feed (button)"}
						disabled={isLoading}
						loading={isLoading}
						tone={"primary"}
						theme={"dark"}
						size={"lg"}
						full
						onClick={() => {
							if (state.id) {
								feedPatchMutation.mutate(state as tFeedPatch);
								return;
							}

							feedCreateMutation.mutate(state as tFeedCreate);
						}}
					/>
				}
			>
				<Container
					layout={"vertical-flex"}
					scroll={"vertical"}
					gap={"md"}
					height={"fit"}
					width={"fit"}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: "light",
						}}
					>
						<LinkTo
							to={"/$locale/buyer/feed/wizard/name"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
						>
							<Badge tweak={badgeTweak}>
								<Tx
									label={"Feed name (label)"}
									preset={"label"}
								/>

								<Typo label={state.name ?? "Not selected"} />
							</Badge>
						</LinkTo>

						<LinkTo
							to={"/$locale/buyer/feed/wizard/location"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
							disabled={!locationFetchQuery.data}
						>
							<Badge
								disabled={!locationFetchQuery.data}
								tweak={badgeTweak}
							>
								<Tx
									label={"Feed location (label)"}
									preset={"label"}
								/>

								{locationFetchQuery.data ? (
									<Typo
										label={locationFetchQuery.data.address}
										wrap={"wrap"}
									/>
								) : (
									<Typo label={"Not selected"} />
								)}
							</Badge>
						</LinkTo>

						<LinkTo
							to={"/$locale/buyer/feed/wizard/sort"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
							disabled={!state.sort || state.sort.length === 0}
						>
							{state.sort && state.sort.length > 0 ? (
								<>
									<Badge
										theme={"light"}
										tweak={badgeTweak}
									>
										<Tx
											label={"Feed sorting (label)"}
											preset={"label"}
										/>
									</Badge>
									<Container
										layout={"vertical-flex"}
										gap={"sm"}
										square={"sm"}
									>
										{state.sort.map((sortItem, index) => (
											<LinkTo
												key={`${sortItem.value}-${index}`}
												to={
													"/$locale/buyer/feed/wizard/sort"
												}
												params={{
													locale,
												}}
												search={state}
												display={"block"}
												full
											>
												<Badge
													tone={"secondary"}
													theme={"light"}
													tweak={badgeTweak}
												>
													<Tx
														label={`Listing common sort value ${sortItem.value} - ${sortItem.sort}`}
													/>
												</Badge>
											</LinkTo>
										))}
									</Container>
								</>
							) : (
								<Badge
									disabled
									tweak={badgeTweak}
								>
									<Tx
										label={"Feed sorting (label)"}
										preset={"label"}
									/>
									<Typo label={"Not selected"} />
								</Badge>
							)}
						</LinkTo>

						<LinkTo
							to={"/$locale/buyer/feed/wizard/category"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
							disabled={
								(categoryCollectionQuery.data?.data ?? [])
									.length === 0
							}
						>
							{(categoryCollectionQuery.data?.data ?? []).length >
							0 ? (
								<>
									<Badge
										theme={"light"}
										tweak={badgeTweak}
									>
										<Tx
											label={"Feed category (label)"}
											preset={"label"}
										/>
									</Badge>
									<Container
										layout={"vertical-flex"}
										gap={"sm"}
										square={"sm"}
									>
										{(
											categoryCollectionQuery.data
												?.data ?? []
										).map((category) => (
											<LinkTo
												key={category.id}
												to={
													"/$locale/buyer/feed/wizard/category"
												}
												params={{
													locale,
												}}
												search={state}
												display={"block"}
												full
											>
												<Badge
													tone={"secondary"}
													theme={"light"}
													tweak={badgeTweak}
												>
													<div
														className={
															"flex flex-col gap-0.5 items-start"
														}
													>
														<Typo
															label={
																category.group
															}
															size={"xs"}
														/>
														<Typo
															label={
																category.category
															}
														/>
													</div>
												</Badge>
											</LinkTo>
										))}
									</Container>
								</>
							) : (
								<Badge
									disabled
									tweak={badgeTweak}
								>
									<Tx
										label={"Feed category (label)"}
										preset={"label"}
									/>
									<Typo label={"Not selected"} />
								</Badge>
							)}
						</LinkTo>

						<LinkTo
							to={"/$locale/buyer/feed/wizard/condition"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
							disabled={
								!state.filter?.conditionIn ||
								state.filter.conditionIn.length === 0
							}
						>
							{state.filter?.conditionIn &&
							state.filter.conditionIn.length > 0 ? (
								<>
									<Badge
										theme={"light"}
										tweak={badgeTweak}
									>
										<Tx
											label={"Feed condition (label)"}
											preset={"label"}
										/>
									</Badge>
									<Container
										layout={"vertical-flex"}
										gap={"sm"}
										square={"sm"}
									>
										{state.filter.conditionIn.map(
											(condition) => (
												<LinkTo
													key={condition}
													to={
														"/$locale/buyer/feed/wizard/condition"
													}
													params={{
														locale,
													}}
													search={state}
													display={"block"}
													full
												>
													<Badge
														tone={"secondary"}
														theme={"light"}
														tweak={badgeTweak}
													>
														<Tx
															label={`Condition - Overall [${condition}] (hint)`}
														/>
													</Badge>
												</LinkTo>
											),
										)}
									</Container>
								</>
							) : (
								<Badge
									disabled
									tweak={badgeTweak}
								>
									<Tx
										label={"Feed condition (label)"}
										preset={"label"}
									/>
									<Typo label={"Not selected"} />
								</Badge>
							)}
						</LinkTo>
					</VariantProvider>
				</Container>
			</TitleContainer>
		);
	},
});
