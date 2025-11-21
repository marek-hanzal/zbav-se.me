import { TrashIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import type { OptionalId } from "@use-pico/common/type";
import { CategoryValueList } from "@zbav-se.me/common/category";
import { LocationBadgeValue } from "@zbav-se.me/common/location";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC, ReactNode } from "react";

export namespace FeedDetailContainer {
	export namespace LinkTo {
		export type Type =
			| "name"
			| "title"
			| "location"
			| "sort"
			| "category"
			| "condition"
			| "age"
			| "view";

		export interface Props {
			feedId: string;
			type: LinkTo.Type;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props extends Container.Props {
		locale: string;
		feed: OptionalId<tFeed>;
		renderLinkTo?: FeedDetailContainer.LinkTo.RenderFn;
		onDelete?(): Promise<void>;
	}
}

export const FeedDetailContainer: FC<FeedDetailContainer.Props> = ({
	locale,
	feed,
	renderLinkTo,
	onDelete,
	...props
}) => {
	const feedDeleteMutation = withFeedDeleteMutation.useMutation({
		async onPostMutation() {
			return onDelete?.();
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
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "name",
								})
							: null
					}
				/>

				<BadgeValue
					textLabel={"Feed title (label)"}
					textValue={feed.query?.filter?.title || "Feed title not filled"}
					action={
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "title",
								})
							: null
					}
				/>

				<LocationBadgeValue
					locationId={feed.locationId}
					textLabel={"Feed location (label)"}
					textValue={"Feed location not selected"}
					action={
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "location",
								})
							: null
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
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "sort",
								})
							: null
					}
				/>

				<CategoryValueList
					categoryIdIn={feed.query?.filter?.categoryIdIn}
					textTitle={"Feed category (label)"}
					textEmpty={"Feed category not selected"}
					action={
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "category",
								})
							: null
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
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "condition",
								})
							: null
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
						feed.id
							? renderLinkTo?.({
									feedId: feed.id,
									type: "age",
								})
							: null
					}
				/>

				{feed.id ? (
					<>
						{renderLinkTo?.({
							feedId: feed.id,
							type: "view",
						})}

						{onDelete ? (
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
						) : null}
					</>
				) : null}
			</VariantProvider>
		</Container>
	);
};
