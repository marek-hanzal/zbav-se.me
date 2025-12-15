import { EditIcon, Icon, TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container, type LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/user";
import type { FC } from "react";
import { CategoryValue } from "~/app/category/ui/CategoryValue";
import { TitleValue } from "~/app/feed/ui/value/TitleValue";
import { GalleryValue } from "~/app/gallery/ui/GalleryValue";
import { LocationValue } from "~/app/location/ui/LocationValue";
import { AgeValue } from "./value/AgeValue";
import { ConditionValue } from "./value/ConditionValue";
import { NameValue } from "./value/NameValue";
import { SortValue } from "./value/SortValue";

export namespace Feed {
	export interface Value {
		gallery?: Partial<GalleryValue.Props>;
		name?: Partial<LabelValue.PropsEx>;
		category?: Partial<CategoryValue.Props>;
		location?: Partial<LabelValue.PropsEx>;
		sort?: Partial<SortValue.Props>;
		condition?: Partial<ConditionValue.Props>;
		age?: Partial<AgeValue.Props>;
		title?: Partial<TitleValue.Props>;
	}

	/**
	 * Props for the Feed detail container component.
	 *
	 * This component displays feed details and allows editing individual fields
	 * through inline editable value components.
	 */
	export interface Props extends Container.Props {
		/**
		 * Locale string for internationalized content
		 */
		locale: string;
		/**
		 * Feed data to display and edit
		 */
		feed: tFeed;
		values?: Feed.Value;
		/**
		 * If true, hides the delete button
		 */
		noDelete: boolean | undefined;
	}
}

/**
 * Feed detail container component.
 *
 * Displays a feed's details including hero image, name, category, location,
 * sort preferences, condition, age, and title. Each field can be edited inline
 * through dedicated value components. Also provides functionality to:
 * - Upload/manage hero images via gallery upload sheet
 * - Delete the feed (unless `noDelete` is true)
 *
 * @example
 * ```tsx
 * <Feed
 *   locale="en"
 *   feed={feedData}
 *   noDelete={false}
 * />
 * ```
 */
export const Feed: FC<Feed.Props> = ({
	locale,
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
			data-ui="FeedDetailContainer[Container]"
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
				feed={feed}
				{...values?.name}
			/>

			<CategoryValue
				categoryIdIn={feed.query?.filter?.categoryIdIn}
				textLabel={translator.text("Feed category (label)")}
				textEmpty={translator.text("Feed category not selected")}
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

			<SortValue
				feed={feed}
				{...values?.sort}
			/>

			<ConditionValue
				feed={feed}
				{...values?.condition}
			/>

			<AgeValue
				feed={feed}
				{...values?.age}
			/>

			<TitleValue
				feed={feed}
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
