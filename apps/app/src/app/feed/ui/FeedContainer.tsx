import { useParams } from "@tanstack/react-router";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/session";
import {
	withCategoryCollectionQuery,
	withLocationFetchQuery,
} from "@zbav-se.me/sdk/query";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace FeedContainer {
	export interface Props extends Container.Props {
		feed: tFeed;
	}
}

export const FeedContainer: FC<FeedContainer.Props> = ({ feed, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	const locationFetchQuery = withLocationFetchQuery.useQuery(
		{
			where: {
				id: feed.locationId,
			},
		},
		{
			enabled: !!feed.locationId,
		},
	);

	const categoryCollectionQuery = withCategoryCollectionQuery.useQuery(
		{
			where: {
				idIn: feed.filter?.categoryIdIn,
			},
		},
		{
			enabled: !!feed.filter?.categoryIdIn?.length,
		},
	);

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
					to={"/$locale/buyer/feed/$id/edit/name"}
					params={{
						locale,
						id: feed.id,
					}}
					display={"block"}
					full
				>
					<BadgeValue
						textLabel={"Feed name (label)"}
						textValue={feed.name}
					/>
				</LinkTo>

				<LinkTo
					to={"/$locale/buyer/feed/$id/edit/title"}
					params={{
						locale,
						id: feed.id,
					}}
					display={"block"}
					full
				>
					<BadgeValue
						textLabel={"Feed title (label)"}
						textValue={
							feed.filter?.title || "Feed title not filled"
						}
					/>
				</LinkTo>

				<Data
					result={locationFetchQuery}
					renderSuccess={({ data }) => (
						<LinkTo
							to={"/$locale/buyer/feed/$id/edit/location"}
							params={{
								locale,
								id: feed.id,
							}}
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
							to={"/$locale/buyer/feed/$id/edit/location"}
							params={{
								locale,
								id: feed.id,
							}}
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
						to={"/$locale/buyer/feed/$id/edit/sort"}
						params={{
							locale,
							id: feed.id,
						}}
						display={"block"}
						full
					>
						<ContainerValueList
							textTitle={"Feed sorting (label)"}
							textEmpty={"Feed sorting not selected"}
							items={(feed.sort ?? []).map((sortItem, index) => ({
								id: `${sortItem.value}-${index}`,
								...sortItem,
							}))}
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
								to={"/$locale/buyer/feed/$id/edit/category"}
								params={{
									locale,
									id: feed.id,
								}}
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
								to={"/$locale/buyer/feed/$id/edit/category"}
								params={{
									locale,
									id: feed.id,
								}}
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
						to={"/$locale/buyer/feed/$id/edit/condition"}
						params={{
							locale,
							id: feed.id,
						}}
						display={"block"}
						full
					>
						<ContainerValueList
							textTitle={"Feed condition (label)"}
							textEmpty={"Feed condition not selected"}
							items={(feed.filter?.conditionIn ?? []).map(
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
						to={"/$locale/buyer/feed/$id/edit/age"}
						params={{
							locale,
							id: feed.id,
						}}
						display={"block"}
						full
					>
						<ContainerValueList
							textTitle={"Feed age (label)"}
							textEmpty={"Feed age not selected"}
							items={(feed.filter?.ageIn ?? []).map((age) => ({
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
