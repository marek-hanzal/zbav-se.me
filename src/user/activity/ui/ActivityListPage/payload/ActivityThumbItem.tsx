import type { FC } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translation";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { CloseButton } from "~/common/ui/button";
import { withListingQuery } from "~/public/listing/query/withListingQuery";
import type { ThumbSchema } from "~/server/database/@table/ActivityTableSchema/ThumbSchema";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";

export namespace ActivityThumbItem {
	export interface Props {
		item: ThumbSchema.Type;
	}
}

export const ActivityThumbItem: FC<ActivityThumbItem.Props> = ({ item }) => {
	const locale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const { data: listing } = withListingQuery.useFetchQuery(item.payload.listingId);
	const hero = useUpload(listing.withImageUrl);
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
							label={toTimeDiff({
								locale,
								time: item.timestamp,
							})}
							data-ui-text="xs"
							data-ui-opacity="7"
						/>
					</Container>
				}
				onClick={() => {
					setIsOpen(true);
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
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Activity thumb (title)"),
					right: <CloseButton onClick={close} />,
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
