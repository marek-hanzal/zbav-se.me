import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import type { Container as ContainerType } from "@use-pico/client/ui/container";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";
import { FeedAgeValueList } from "./FeedAgeValueList";
import { FeedCategoryBadge } from "./FeedCategoryBadge";
import { FeedConditionValueList } from "./FeedConditionValueList";
import { FeedLocationBadge } from "./FeedLocationBadge";
import { FeedNameBadge } from "./FeedNameBadge";
import { FeedTitleBadge } from "./FeedTitleBadge";

export namespace FeedDetailContainer {
	export interface Props extends ContainerType.Props {
		locale: string;
		feed: tFeed;
		onDelete?(): Promise<void>;
	}
}

export const FeedDetailContainer: FC<FeedDetailContainer.Props> = ({
	locale,
	feed,
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
			gap={"md"}
			height={"content"}
			width={"fit"}
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
				<FeedNameBadge feed={feed} />

				<FeedTitleBadge feed={feed} />

				<FeedLocationBadge
					feedId={feed.id}
					locale={locale}
					locationId={feed.locationId}
					latLon={feed.query?.meta?.latLon}
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
				/>

				<FeedCategoryBadge
					feedId={feed.id}
					locale={locale}
					categoryIdIn={feed.query?.filter?.categoryIdIn}
				/>

				<FeedConditionValueList feed={feed} />

				<FeedAgeValueList feed={feed} />

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
			</VariantProvider>
		</Container>
	);
};
