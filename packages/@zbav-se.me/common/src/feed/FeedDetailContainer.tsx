import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
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
import { FeedSortValueList } from "./FeedSortValueList";
import { FeedTitleBadge } from "./FeedTitleBadge";

export namespace FeedDetailContainer {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeed;
	}
}

export const FeedDetailContainer: FC<FeedDetailContainer.Props> = ({ locale, feed, ...props }) => {
	const feedDeleteMutation = withFeedDeleteMutation.useMutation();

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
					locale={locale}
					feed={feed}
				/>

				<FeedSortValueList feed={feed} />

				<FeedCategoryBadge
					locale={locale}
					feed={feed}
				/>

				<FeedConditionValueList feed={feed} />

				<FeedAgeValueList feed={feed} />

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
			</VariantProvider>
		</Container>
	);
};
