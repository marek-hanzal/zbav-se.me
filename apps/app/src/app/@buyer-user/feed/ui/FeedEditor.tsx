import { EditIcon, Icon, TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container, type LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import type { FC } from "react";
import { AgeValueList } from "~/app/@common/age/ui/AgeValueList";
import { ConditionValueList } from "~/app/@common/condition/ui/ConditionValueList";
import { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/app/@common/gallery/ui/GalleryValue";
import { LocationValue } from "~/app/@common/location/ui/LocationValue";
import { RangeValue } from "~/app/@common/location/ui/RangeValue";
import { NameValue } from "~/app/@common/name/ui/NameValue";
import { SortValue } from "~/app/@common/sort/ui/SortValue";
import { TitleValue } from "~/app/@common/title/ui/TitleValue";
import { WarrantyValueList } from "~/app/@common/warranty/ui/WarrantyValueList";
import { CategoryValueList } from "~/app/@session/category/ui/CategoryValueList";

export namespace FeedEditor {
	export interface Value {
		gallery?: Partial<GalleryValue.Props>;
		name?: Partial<NameValue.Props>;
		category?: Partial<CategoryValueList.Props>;
		location?: Partial<LabelValue.PropsEx>;
		range?: Partial<RangeValue.Props>;
		sort?: Partial<SortValue.Props>;
		condition?: Partial<ConditionValueList.Props>;
		age?: Partial<AgeValueList.Props>;
		delivery?: Partial<DeliveryValueList.Props>;
		warranty?: Partial<WarrantyValueList.Props>;
		title?: Partial<TitleValue.Props>;
	}

	/**
	 * Props for the Feed detail editor component.
	 *
	 * This component displays feed details and allows editing individual fields
	 * through inline editable value components.
	 */
	export interface Props extends Container.Props {
		/**
		 * Feed data to display and edit
		 */
		feed: tFeed;
		values?: FeedEditor.Value;
		/**
		 * If true, hides the delete button
		 */
		noDelete: boolean | undefined;
	}
}

/**
 * Feed detail editor component.
 *
 * Displays a feed's details including hero image, name, category, location,
 * sort preferences, condition, age, and title. Each field can be edited inline
 * through dedicated value components. Also provides functionality to:
 * - Upload/manage hero images via gallery upload sheet
 * - Delete the feed (unless `noDelete` is true)
 *
 * @example
 * ```tsx
 * <FeedEditor
 *   feed={feedData}
 *   noDelete={false}
 * />
 * ```
 */
export const FeedEditor: FC<FeedEditor.Props> = ({
	feed,
	values,
	noDelete = false,
	children,
	ui,
	...props
}) => {
	const feedDeleteMutation = withFeedDeleteMutation.useMutation();

	return (
		<Container
			data-ui="FeedDetailEditor[Container]"
			ui={{
				layout: "vertical-flex",
				height: "content",
				width: "full",
				gap: "lg",
				disabled: feedDeleteMutation.isPending,
				...ui,
			}}
			{...props}
		>
			<GalleryValue
				label={translator.text("Feed photo gallery (label)")}
				uploads={
					feed.upload
						? [
								feed.upload,
							]
						: []
				}
				{...values?.gallery}
			/>

			<NameValue
				name={feed.name}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.name}
			/>

			<CategoryValueList
				categoryIdIn={feed.query?.filter?.categoryIdIn}
				textLabel={translator.text("Feed category (label)")}
				textEmpty={translator.text("Feed category not selected")}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.category}
			/>

			<LocationValue
				locationId={feed.locationId}
				textLabel={translator.text("Feed location (label)")}
				textEmpty={translator.text("Feed location not selected")}
				textHint={translator.text("Feed location (hint)")}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.location}
			/>

			<RangeValue
				range={feed.query?.filter?.range}
				ui={{
					disabled: !feed.query?.meta?.latLon,
				}}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.range}
			/>

			<SortValue
				sort={feed.query?.sort ?? []}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.sort}
			/>

			<ConditionValueList
				conditionIn={feed.query?.filter?.conditionIn ?? []}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.condition}
			/>

			<AgeValueList
				ageIn={feed.query?.filter?.ageIn ?? []}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.age}
			/>

			<DeliveryValueList
				deliveryIn={feed.query?.filter?.deliveryIn ?? []}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.delivery}
			/>

			<WarrantyValueList
				warrantyIn={feed.query?.filter?.warrantyIn ?? []}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.warranty}
			/>

			<TitleValue
				title={feed.query?.filter?.title ?? null}
				textLabel={translator.text("Feed title (label)")}
				textEmpty={translator.text("Feed title not filled")}
				textHint={translator.text("Feed title (hint)")}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				{...values?.title}
			/>

			{children}

			{noDelete ? null : (
				<ConfirmButton
					iconEnabled={TrashIcon}
					iconProps={{
						ui: {
							text: "xl",
						},
					}}
					buttonProps={{
						label: translator.text("Delete feed (button)"),
					}}
					confirmProps={{
						iconEnabled: TrashIcon,
						ui: {
							tone: "danger",
							theme: "light",
						},
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
			)}
		</Container>
	);
};
