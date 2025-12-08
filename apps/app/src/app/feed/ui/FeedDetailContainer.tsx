import { TrashIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import {
	withFeedDeleteMutation,
	withFeedGalleryCreateMutation,
} from "@zbav-se.me/sdk/mutation/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
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
	...props
}) => {
	const feedDeleteMutation = withFeedDeleteMutation.useMutation();
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			data-ui="FeedDetailContainer-root"
			layout={"vertical-flex"}
			gap={"md"}
			height={"content"}
			width={"full"}
			disabled={feedDeleteMutation.isPending}
			square={"md"}
			{...props}
		>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "primary",
					theme: "light",
				}}
			>
				{feed.upload ? (
					<HeroImage
						src={feed.upload.url}
						alt={`Hero image for feed ${feed.id}`}
						visible
						round={"default"}
						className="w-full h-42"
						onClick={() => setIsGalleryOpen((prev) => !prev)}
					/>
				) : (
					<Badge
						tone={"neutral"}
						theme={"light"}
						className="w-full h-42 p-0"
						round={"md"}
						onClick={() => setIsGalleryOpen((prev) => !prev)}
					>
						<Status
							icon={PhotoIcon}
							iconProps={{
								size: "lg",
							}}
							tone={"primary"}
							theme={"light"}
							textTitle={"Feed - Select hero image (label)"}
							titleProps={{
								font: "normal",
								size: "md",
							}}
						/>
					</Badge>
				)}

				<GalleryUploadSheet
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
						size={"xl"}
						justify={"start"}
					/>
				)}

				{children}
			</VariantProvider>
		</Container>
	);
};
