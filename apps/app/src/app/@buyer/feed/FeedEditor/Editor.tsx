import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
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
import type { Data } from "./Data";

export namespace Editor {
	export interface Props extends Container.Props {
		feed: tFeed;
		onView(view: Data.View): void;
	}
}

export const Editor: FC<Editor.Props> = ({ feed, onView, ui, ...props }) => {
	return (
		<Container
			data-ui={"FeedEditor-[Container.content]"}
			ui={{
				flow: "vertical",
				inner: "default",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
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
					onClick={() => onView("gallery")}
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
					onClick={() => onView("name")}
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
					onClick={() => onView("category")}
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
					onClick={() => onView("location")}
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
					onClick={() => onView("range")}
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
					onClick={() => onView("sort")}
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
					onClick={() => onView("condition")}
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
					onClick={() => onView("age")}
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
					onClick={() => onView("delivery")}
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
					onClick={() => onView("warranty")}
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
					onClick={() => onView("title")}
				/>
			</Group>
		</Container>
	);
};
