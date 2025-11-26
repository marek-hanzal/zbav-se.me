import { EditIcon, Icon, TrashIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import type { OptionalId } from "@use-pico/common/type";
import { CategoryValueList } from "@zbav-se.me/common/category";
import { LocationBadgeValue } from "@zbav-se.me/common/location";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedDeleteMutation, withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { type FC, useState } from "react";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedDetailContainer {
	export interface Props extends Container.Props {
		locale: string;
		feed: OptionalId<tFeed>;
		onDelete?(): Promise<void>;
	}
}

export const FeedDetailContainer: FC<FeedDetailContainer.Props> = ({
	locale,
	feed,
	onDelete,
	...props
}) => {
	const [change, setChange] = useState(false);
	const [isName, setIsName] = useState(false);
	const [name, setName] = useState(feed.name);

	const feedDeleteMutation = withFeedDeleteMutation.useMutation({
		async onPostMutation() {
			return onDelete?.();
		},
	});
	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
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
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
					}
					onClick={() => setIsName(true)}
				/>

				<BadgeValue
					textLabel={"Feed title (label)"}
					textValue={feed.query?.filter?.title || "Feed title not filled"}
					action={
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
					}
				/>

				<LocationBadgeValue
					locationId={feed.locationId}
					textLabel={"Feed location (label)"}
					textValue={"Feed location not selected"}
					action={
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
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
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
					}
				/>

				<CategoryValueList
					categoryIdIn={feed.query?.filter?.categoryIdIn}
					textTitle={"Feed category (label)"}
					textEmpty={"Feed category not selected"}
					action={
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
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
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
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
						<Icon
							icon={EditIcon}
							size={"sm"}
						/>
					}
				/>

				{feed.id && onDelete ? (
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
			</VariantProvider>

			{feed.id ? (
				<BottomSheet
					isOpen={isName}
					onClose={() => setIsName(false)}
					detent={"content"}
				>
					<FeedNameContainer
						value={name}
						onChange={(value) => {
							setChange(true);
							setName(value);
						}}
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - next and save (button)"}
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={name.length === 0 || feedPatchMutation.isPending}
						full
						onClick={() => {
							if (!change || !feed.id) {
								return;
							}

							feedPatchMutation.mutate(
								{
									id: feed.id,
									...feed,
									name,
								},
								{
									onSuccess() {
										setIsName(false);
									},
								},
							);
						}}
					/>
				</BottomSheet>
			) : null}
		</Container>
	);
};
