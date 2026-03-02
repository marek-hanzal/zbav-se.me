import type { FC } from "react";
import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
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
import type { Editor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor/Editor";

export namespace FeedEditorFields {
	export interface Props extends Pick<Editor.Props, "feed" | "values"> {}
}

export const FeedEditorFields: FC<FeedEditorFields.Props> = ({ feed, values }) => {
	return (
		<>
			<Group>
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
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone: feed.name ? "neutral" : "secondary",
						},
					}}
					{...values?.name}
				/>
			</Group>

			<Group>
				<CategoryValueList
					categoryIdIn={feed.query?.filter?.categoryIdIn}
					textLabel={translator.text("Feed category (label)")}
					textEmpty={translator.text("Feed category not selected")}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.categoryIdIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.category}
				/>
			</Group>

			<Group>
				<LocationValue
					locationId={feed.locationId}
					textLabel={translator.text("Feed location (label)")}
					textEmpty={translator.text("Feed location not selected")}
					textHint={translator.text("Feed location (hint)")}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone: feed.locationId ? "neutral" : "secondary",
						},
					}}
					{...values?.location}
				/>

				<RangeValue
					range={feed.query?.filter?.range}
					ui={{
						disabled: !feed.query?.meta?.latLon,
					}}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone: feed.query?.filter?.range ? "neutral" : "secondary",
						},
					}}
					{...values?.range}
				/>
			</Group>

			<Group>
				<SortValue
					sort={feed.query?.sort ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone: (feed.query?.sort ?? []).length > 0 ? "neutral" : "secondary",
						},
					}}
					{...values?.sort}
				/>
			</Group>

			<Group>
				<ConditionValueList
					conditionIn={feed.query?.filter?.conditionIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.conditionIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.condition}
				/>

				<AgeValueList
					ageIn={feed.query?.filter?.ageIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.ageIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.age}
				/>
			</Group>

			<Group>
				<DeliveryValueList
					deliveryIn={feed.query?.filter?.deliveryIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.deliveryIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.delivery}
				/>
			</Group>

			<Group>
				<WarrantyValueList
					warrantyIn={feed.query?.filter?.warrantyIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.warrantyIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.warranty}
				/>
			</Group>

			<Group>
				<TitleValue
					title={feed.query?.filter?.title ?? null}
					textLabel={translator.text("Feed title (label)")}
					textEmpty={translator.text("Feed title not filled")}
					textHint={translator.text("Feed title (hint)")}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone: feed.query?.filter?.title ? "neutral" : "secondary",
						},
					}}
					{...values?.title}
				/>
			</Group>
		</>
	);
};
