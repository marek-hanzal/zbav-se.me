import type { LabelValue } from "@use-pico/client/ui/container";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedDeleteMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import type { FC } from "react";
import type { AgeValueList } from "~/app/@common/age/ui/AgeValueList";
import type { ConditionValueList } from "~/app/@common/condition/ui/ConditionValueList";
import type { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import type { NameValue } from "~/app/@common/name/ui/NameValue";
import type { SortValue } from "~/app/@common/sort/ui/SortValue";
import type { TitleValue } from "~/app/@common/title/ui/TitleValue";
import type { WarrantyValueList } from "~/app/@common/warranty/ui/WarrantyValueList";
import type { CategoryValueList } from "~/app/@session/category/ui/CategoryValueList";
import type { GalleryValue } from "~/app/v0/@common/gallery/ui/GalleryValue";
import type { RangeValue } from "~/app/v0/@common/location/ui/RangeValue";
import { FeedEditorDeleteButton } from "./FeedEditor/FeedEditorDeleteButton";
import { FeedEditorFields } from "./FeedEditor/FeedEditorFields";

export namespace FeedEditor {
	export interface Value {
		gallery?: Partial<GalleryValue.Props>;
		name?: Partial<NameValue.Props>;
		category?: Partial<CategoryValueList.Props>;
		location?: LabelValue.PropsEx;
		range?: Partial<RangeValue.Props>;
		sort?: Partial<SortValue.Props>;
		condition?: Partial<ConditionValueList.Props>;
		age?: Partial<AgeValueList.Props>;
		delivery?: Partial<DeliveryValueList.Props>;
		warranty?: Partial<WarrantyValueList.Props>;
		title?: Partial<TitleValue.Props>;
	}

	export interface Props extends Container.Props {
		feed: tFeed;
		values?: FeedEditor.Value;
		noDelete: boolean | undefined;
	}
}

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
			<FeedEditorFields
				feed={feed}
				values={values}
			/>

			<Group>
				{children}

				{noDelete ? null : (
					<FeedEditorDeleteButton
						loading={feedDeleteMutation.isPending}
						onDelete={() => {
							feedDeleteMutation.mutate({
								where: {
									id: feed.id,
								},
							});
						}}
					/>
				)}
			</Group>
		</Container>
	);
};
