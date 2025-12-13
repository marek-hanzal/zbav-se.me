import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import {
	withFeedDeleteMutation,
	withFeedGalleryCreateMutation,
} from "@zbav-se.me/sdk/mutation/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { TitleValue } from "~/app/feed/ui/value/TitleValue";
import { GalleryUploadSheet } from "~/app/photo/ui/GalleryUploadSheet";
import { AgeValue } from "./value/AgeValue";
import { CategoryValue } from "./value/CategoryValue";
import { ConditionValue } from "./value/ConditionValue";
import { LocationValue } from "./value/LocationValue";
import { NameValue } from "./value/NameValue";
import { SortValue } from "./value/SortValue";

export namespace Feed {
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
	noDelete = false,
	children,
	ui,
	...props
}) => {
	const feedDeleteMutation = withFeedDeleteMutation.useMutation();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
			{feed.upload ? (
				<HeroImage
					data-ui={"FeedDetailContainer-[HeroImage]"}
					src={feed.upload.url}
					alt={`Hero image for feed ${feed.id}`}
					visible
					round={"default"}
					onClick={() => setIsGalleryOpen((prev) => !prev)}
					ui={{
						width: "full",
					}}
					className="h-42"
				/>
			) : (
				<Container
					data-ui={"FeedDetailContainer-[Container.placeholder]"}
					onClick={() => setIsGalleryOpen((prev) => !prev)}
					ui={{
						tone: "neutral",
						theme: "light",
						round: "md",
						width: "full",
						flow: "horizontal",
						items: "center",
						justify: "center",
						background: "default",
						shadow: true,
						border: true,
					}}
					className="h-42"
				>
					<Status
						data-ui={"FeedDetailContainer-[Status.photo-hint]"}
						icon={PhotoIcon}
						iconProps={{
							ui: {
								text: "3xl",
							},
						}}
						textTitle={"Feed - Select hero image (label)"}
						titleProps={{
							ui: {
								font: "normal",
								text: "lg",
							},
						}}
						ui={{
							tone: "primary",
							theme: "light",
							text: "default",
						}}
					/>
				</Container>
			)}

			<GalleryUploadSheet
				data-ui={"FeedDetailContainer-[GalleryUploadSheet]"}
				withMutation={withFeedGalleryCreateMutation}
				toMutation={(uploadIds) => ({
					feedId: feed.id,
					uploadIds,
				})}
				state={{
					value: isGalleryOpen,
					set: setIsGalleryOpen,
				}}
				onSuccess={() => {}}
				onCancel={() => {}}
			/>

			<NameValue feed={feed} />

			<CategoryValue
				locale={locale}
				feed={feed}
			/>

			<LocationValue
				locale={locale}
				feed={feed}
			/>

			<SortValue feed={feed} />

			<ConditionValue feed={feed} />

			<AgeValue feed={feed} />

			<TitleValue feed={feed} />

			{noDelete ? null : (
				<ConfirmButton
					iconEnabled={TrashIcon}
					buttonProps={{
						ui: {
							tone: "danger",
							theme: "light",
							size: "xl",
							text: "lg",
						},
						iconProps: {
							ui: {
								text: "xl",
							},
						},
						label: translator.text("Delete feed (button)"),
					}}
					confirmProps={{
						iconEnabled: TrashIcon,
						ui: {
							tone: "danger",
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
						tone: "danger",
						size: "xl",
						justify: "start",
					}}
				/>
			)}

			{children}
		</Container>
	);
};
