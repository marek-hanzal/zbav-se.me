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
import { GalleryUploadSheet } from "~/app/photo/ui/GalleryUploadSheet";
import { FeedAgeValueList } from "./FeedAgeValueList";
import { FeedCategoryBadge } from "./FeedCategoryBadge";
import { FeedConditionValueList } from "./FeedConditionValueList";
import { FeedLocationBadge } from "./FeedLocationBadge";
import { FeedNameBadge } from "./FeedNameBadge";
import { FeedSortValueList } from "./FeedSortValueList";
import { FeedTitleBadge } from "./FeedTitleBadge";

export namespace FeedDetailContainer {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeed;
		noDelete: boolean | undefined;
	}
}

export const FeedDetailContainer: FC<FeedDetailContainer.Props> = ({
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
				gap: "default",
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

			<FeedNameBadge feed={feed} />

			<FeedCategoryBadge
				locale={locale}
				feed={feed}
			/>

			<FeedLocationBadge
				locale={locale}
				feed={feed}
			/>

			<FeedSortValueList feed={feed} />

			<FeedConditionValueList feed={feed} />

			<FeedAgeValueList feed={feed} />

			<FeedTitleBadge feed={feed} />

			{noDelete ? null : (
				<ConfirmButton
					iconEnabled={TrashIcon}
					buttonProps={{
						ui: {
							tone: "danger",
						},
						label: translator.text("Delete feed (button)"),
					}}
					confirmProps={{
						iconEnabled: TrashIcon,
						ui: {
							tone: "danger",
							theme: "dark",
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
