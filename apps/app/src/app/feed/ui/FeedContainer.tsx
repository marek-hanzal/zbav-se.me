import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRightIcon, EditIcon, TrashIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import type { OptionalId } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/session";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/session";
import { withCategoryCollectionQuery, withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace FeedContainer {
	export interface Props extends Container.Props {
		feed: OptionalId<tFeed>;
	}
}

export const FeedContainer: FC<FeedContainer.Props> = ({ feed, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const navigate = useNavigate();

	const locationFetchQuery = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: feed.locationId ?? undefined,
		},
	});

	const categoryCollectionQuery = withCategoryCollectionQuery.useSuspenseQuery({
		where: {
			idIn: feed.query?.filter?.categoryIdIn,
		},
	});

	const feedDeleteMutation = withFeedDeleteMutation.useMutation({
		onPostMutation() {
			return navigate({
				to: "/$locale/buyer/feed/select",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			height={"fit"}
			width={"fit"}
			disabled={feedDeleteMutation.isPending}
			{...props}
		>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "primary",
					theme: "light",
				}}
			>
				<BadgeValue
					textLabel={"Feed name (label)"}
					textValue={feed.name}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/name"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<BadgeValue
					textLabel={"Feed title (label)"}
					textValue={feed.query?.filter?.title || "Feed title not filled"}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/name"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<BadgeValue
					textLabel={"Feed location (label)"}
					textValue={
						feed.locationId
							? locationFetchQuery.data.address
							: "Feed location not selected"
					}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/location"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<ContainerValueList
					textTitle={"Feed sorting (label)"}
					textEmpty={"Feed sorting not selected"}
					items={(feed.query?.sort ?? []).map((sortItem, index) => ({
						id: `${sortItem.field}-${index}`,
						...sortItem,
					}))}
					render={(sortItem) => (
						<Tx
							label={`Listing common sort value ${sortItem.field} - ${sortItem.direction}`}
						/>
					)}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/sort"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<ContainerValueList
					textTitle={"Feed category (label)"}
					textEmpty={"Feed category not selected"}
					items={
						feed.query?.filter?.categoryIdIn?.length
							? categoryCollectionQuery.data.data
							: []
					}
					render={(category) => (
						<div className={"flex flex-col gap-0.5 items-start"}>
							<Typo
								label={category.group}
								size={"xs"}
							/>
							<Typo label={category.category} />
						</div>
					)}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/category"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<ContainerValueList
					textTitle={"Feed condition (label)"}
					textEmpty={"Feed condition not selected"}
					items={(feed.query?.filter?.conditionIn ?? []).map((condition) => ({
						id: String(condition),
						condition,
					}))}
					render={(item) => (
						<Tx label={`Condition - Overall [${item.condition}] (hint)`} />
					)}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/condition"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				<ContainerValueList
					textTitle={"Feed age (label)"}
					textEmpty={"Feed age not selected"}
					items={(feed.query?.filter?.ageIn ?? []).map((age) => ({
						id: String(age),
						age,
					}))}
					render={(item) => <Tx label={`Condition - Age [${item.age}] (hint)`} />}
					action={
						feed.id ? (
							<LinkTo
								icon={EditIcon}
								to={"/$locale/buyer/feed/$id/edit/age"}
								params={{
									locale,
									id: feed.id,
								}}
							/>
						) : null
					}
				/>

				{feed.id ? (
					<>
						<LinkTo
							to={"/$locale/buyer/listing/list"}
							params={{
								locale,
							}}
							search={{
								query: feed.query,
							}}
							full
						>
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								label={"View feed (button)"}
								size={"xl"}
							/>
						</LinkTo>

						<ConfirmButton
							tone={"danger"}
							iconEnabled={TrashIcon}
							buttonProps={{
								tone: "danger",
								label: translator.text("Delete feed (button)"),
							}}
							confirmProps={{
								iconEnabled: TrashIcon,
								tone: "danger",
								theme: "dark",
								label: translator.text("Really delete feed (button)"),
								onClick() {
									feedDeleteMutation.mutate({
										where: {
											id: feed.id,
										},
									});
								},
							}}
							loading={feedDeleteMutation.isPending}
							full
							size={"lg"}
						/>
					</>
				) : null}
			</VariantProvider>
		</Container>
	);
};
