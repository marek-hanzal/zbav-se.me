import { useParams } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { VariantProvider } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace FeedCard {
	export interface Props extends Container.Props {
		feed: tFeed;
	}
}

export const FeedCard: FC<FeedCard.Props> = ({ feed, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			height={"fit"}
			width={"fit"}
			{...props}
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
						textValue={state.name ?? "Feed name not selected"}
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
							state.filter?.title || "Feed title not filled"
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
								to={"/$locale/buyer/feed/wizard/category"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<ContainerValueList
									textTitle={"Feed category (label)"}
									textEmpty={"Feed category not selected"}
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
											<Typo label={category.category} />
										</div>
									)}
								/>
							</LinkTo>
						</Container>
					)}
					renderEmpty={() => (
						<Container height={"auto"}>
							<LinkTo
								to={"/$locale/buyer/feed/wizard/category"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<ContainerValueList
									textTitle={"Feed category (label)"}
									textEmpty={"Feed category not selected"}
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
							items={(state.filter?.conditionIn ?? []).map(
								(condition) => ({
									id: String(condition),
									condition,
								}),
							)}
							render={(item) => (
								<Tx
									label={`Condition - Overall [${item.condition}] (hint)`}
								/>
							)}
						/>
					</LinkTo>
				</Container>

				<Container height={"auto"}>
					<LinkTo
						to={"/$locale/buyer/feed/wizard/age"}
						params={{
							locale,
						}}
						search={state}
						display={"block"}
						full
					>
						<ContainerValueList
							textTitle={"Feed age (label)"}
							textEmpty={"Feed age not selected"}
							items={(state.filter?.ageIn ?? []).map((age) => ({
								id: String(age),
								age,
							}))}
							render={(item) => (
								<Tx
									label={`Condition - Age [${item.age}] (hint)`}
								/>
							)}
						/>
					</LinkTo>
				</Container>
			</VariantProvider>
		</Container>
	);
};
