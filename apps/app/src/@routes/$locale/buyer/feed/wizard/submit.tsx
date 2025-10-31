import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	BadgeValue,
	Button,
	CloseIcon,
	Container,
	ContainerValueList,
	Data,
	LinkTo,
	SpinnerIcon,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
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
				right={
					<LinkTo
						icon={CloseIcon}
						to={"/$locale/buyer/feed/select"}
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

		const locationFetchQuery = withLocationFetchQuery.useQuery(
			{
				where: {
					id: state.locationId,
				},
			},
			{
				enabled: !!state.locationId,
			},
		);

		const categoryCollectionQuery = withCategoryCollectionQuery.useQuery(
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
				right={
					<LinkTo
						icon={CloseIcon}
						to={"/$locale/buyer/feed/select"}
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
							<BadgeValue
								textLabel={"Feed name (label)"}
								textValue={
									state.name ?? "Feed name not selected"
								}
							/>
						</LinkTo>

						<Data
							result={locationFetchQuery}
							renderSuccess={({ data }) => (
								<LinkTo
									to={"/$locale/buyer/feed/wizard/location"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
									full
								>
									<BadgeValue
										textLabel={"Feed location (label)"}
										textValue={data.address}
									/>
								</LinkTo>
							)}
							renderEmpty={() => (
								<LinkTo
									to={"/$locale/buyer/feed/wizard/location"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
									full
								>
									<BadgeValue
										textLabel={"Feed location (label)"}
										textValue={"Feed location not selected"}
									/>
								</LinkTo>
							)}
						/>

						<Container height={"auto"}>
							<LinkTo
								to={"/$locale/buyer/feed/wizard/sort"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<ContainerValueList
									textTitle={"Feed sorting (label)"}
									textEmpty={"Feed sorting not selected"}
									items={(state.sort ?? []).map(
										(sortItem, index) => ({
											id: `${sortItem.value}-${index}`,
											...sortItem,
										}),
									)}
									render={(sortItem) => (
										<Tx
											label={`Listing common sort value ${sortItem.value} - ${sortItem.sort}`}
										/>
									)}
								/>
							</LinkTo>
						</Container>

						<Data
							result={categoryCollectionQuery}
							renderSuccess={({ data }) => (
								<Container height={"auto"}>
									<LinkTo
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
										<ContainerValueList
											textTitle={"Feed category (label)"}
											textEmpty={
												"Feed category not selected"
											}
											items={data.data}
											render={(category) => (
												<div
													className={
														"flex flex-col gap-0.5 items-start"
													}
												>
													<Typo
														label={category.group}
														size={"xs"}
													/>
													<Typo
														label={
															category.category
														}
													/>
												</div>
											)}
										/>
									</LinkTo>
								</Container>
							)}
							renderEmpty={() => (
								<Container height={"auto"}>
									<LinkTo
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
										<ContainerValueList
											textTitle={"Feed category (label)"}
											textEmpty={
												"Feed category not selected"
											}
											items={[]}
											render={() => null}
										/>
									</LinkTo>
								</Container>
							)}
						/>

						<Container height={"auto"}>
							<LinkTo
								to={"/$locale/buyer/feed/wizard/condition"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<ContainerValueList
									textTitle={"Feed condition (label)"}
									textEmpty={"Feed condition not selected"}
									items={(
										state.filter?.conditionIn ?? []
									).map((condition) => ({
										id: String(condition),
										condition,
									}))}
									render={(item) => (
										<Tx
											label={`Condition - Overall [${item.condition}] (hint)`}
										/>
									)}
								/>
							</LinkTo>
						</Container>
					</VariantProvider>
				</Container>
			</TitleContainer>
		);
	},
});
