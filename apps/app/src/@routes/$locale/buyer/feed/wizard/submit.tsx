import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon, SpinnerIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tFeedCreate, tFeedPatch } from "@zbav-se.me/sdk/api/session";
import {
	withFeedCreateMutation,
	withFeedPatchMutation,
} from "@zbav-se.me/sdk/mutation";
import {
	withCategoryCollectionQuery,
	withLocationFetchQuery,
} from "@zbav-se.me/sdk/query";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/submit")({
	validateSearch: FeedWizardSchema,
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

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
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
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
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
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

						<LinkTo
							to={"/$locale/buyer/feed/wizard/title"}
							params={{
								locale,
							}}
							search={state}
							display={"block"}
							full
						>
							<BadgeValue
								textLabel={"Feed title (label)"}
								textValue={
									state.filter?.title ||
									"Feed title not filled"
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
