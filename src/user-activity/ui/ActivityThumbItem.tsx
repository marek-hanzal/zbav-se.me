import type { FC } from "react";
import { useState } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import type { ThumbSchema } from "~/database/schema/ActivityTableThumbSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { withListingQuery } from "~/public-listing/query/withListingQuery";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export namespace ActivityThumbItem {
	export interface Props {
		item: ThumbSchema.Type;
	}
}

export const ActivityThumbItem: FC<ActivityThumbItem.Props> = ({ item }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const [isOpen, setIsOpenFn] = useState(false);
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
	const hero = getUploadFn(listing.withImageUrl);
	const patchMutation = withActivityQuery.usePatchMutation({
		invalidate: [],
	});

	return (
		<>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={
							item.payload.thumb === "like"
								? "You got like (label)"
								: "You got dislike (label)"
						}
						data-ui-tone={
							item.archivedAt
								? "neutral"
								: item.payload.thumb === "like"
									? "secondary"
									: "neutral"
						}
						data-ui-theme="light"
						data-ui-font={item.archivedAt ? "normal" : "bold"}
						data-ui-color="lead"
					/>
				}
				bottom={
					<Container data-ui-flow="vertical">
						<Typo
							label={"listing.title"}
							data-ui-text="sm"
						/>
						<Typo
							label={toTimeDiffFn({
								locale,
								time: item.timestamp,
							})}
							data-ui-text="xs"
							data-ui-opacity="7"
						/>
					</Container>
				}
				onClick={() => {
					setIsOpenFn(true);
					if (item.archivedAt) {
						return;
					}
					patchMutation.mutate({
						patch: {
							archivedAt: new Date(),
						},
						query: {
							where: {
								id: item.id,
							},
						},
					});
				}}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				headerFn={({ closeFn }) => ({
					title: translator.textFn("Activity thumb (title)"),
					right: <CloseButton onClick={closeFn} />,
				})}
			>
				<Container
					data-ui-inner="default"
					data-ui-flow="vertical"
					data-ui-gap="default"
				>
					<Tx label={"listing.title"} />
					<Tx label={`#${listing.id}`} />
				</Container>
			</BottomSheet>
		</>
	);
};
