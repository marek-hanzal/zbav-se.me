import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { DeliveryValueList } from "~/common/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { TitleValue } from "~/common/title/ui/TitleValue";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import type { FeedEditor } from "./FeedEditor";
import { AgeValueList } from "./value/AgeValueList";
import { CategoryValueList } from "./value/CategoryValueList";
import { ConditionValueList } from "./value/ConditionValueList";
import { NameValue } from "./value/NameValue";
import { RangeValue } from "./value/RangeValue";
import { SortValue } from "./value/SortValue";
import { WarrantyValueList } from "./value/WarrantyValueList";

export namespace Editor {
	export type Section = "header";

	export interface Props extends Omit<Container.Props, "hidden">, MarkSuspense.Props {
		feed: FeedSchema.Type;
		onView(view: FeedEditor.View): void;
		hidden?: readonly Section[];
	}
}

export const Editor: FC<Editor.Props> = ({
	_suspense,
	feed,
	onView,
	hidden,
	children,
	...props
}) => {
	const locationId = feed.query?.meta?.locationId;

	return (
		<Container
			data-ui={"FeedEditor-[Container.content]"}
			data-ui-flow="vertical"
			data-ui-inner="default"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			<Group>
				<CurrentRestriction _suspense={_suspense} />
			</Group>

			{hidden?.includes("header") ? null : (
				<Group>
					<GalleryValue
						data-action={"edit feed gallery"}
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
						data-action={"edit feed name"}
						name={feed.name}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.name ? "neutral" : "secondary",
						}}
						onClick={() => onView("name")}
					/>
				</Group>
			)}

			<Group>
				<CategoryValueList
					_suspense={"I know"}
					data-action={"edit feed category"}
					categoryIdIn={feed.query?.filter?.categoryIdIn}
					textLabel={translator.text("Feed category (label)")}
					textEmpty={translator.text("Feed category not selected")}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.filter?.categoryIdIn ?? []).length > 0
								? "neutral"
								: "secondary",
					}}
					onClick={() => onView("category")}
				/>
			</Group>

			<Group>
				<LocationValue
					_suspense={"I know"}
					data-action={"edit feed location"}
					locationId={locationId}
					textLabel={translator.text("Feed location (label)")}
					textEmpty={translator.text("Feed location not selected")}
					textHint={translator.text("Feed location (hint)")}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone": locationId ? "neutral" : "secondary",
					}}
					onClick={() => onView("location")}
				/>

				<RangeValue
					data-action={"edit feed range"}
					range={feed.query?.filter?.range}
					data-ui-disabled={!locationId}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone": feed.query?.filter?.range ? "neutral" : "secondary",
					}}
					onClick={() => onView("range")}
				/>
			</Group>

			<Group>
				<SortValue
					data-action={"edit feed sort"}
					sort={feed.query?.sort ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.sort ?? []).length > 0 ? "neutral" : "secondary",
					}}
					onClick={() => onView("sort")}
				/>
			</Group>

			<Group>
				<ConditionValueList
					data-action={"edit feed condition"}
					conditionIn={feed.query?.filter?.conditionIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.filter?.conditionIn ?? []).length > 0
								? "neutral"
								: "secondary",
					}}
					onClick={() => onView("condition")}
				/>

				<AgeValueList
					data-action={"edit feed age"}
					ageIn={feed.query?.filter?.ageIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.filter?.ageIn ?? []).length > 0 ? "neutral" : "secondary",
					}}
					onClick={() => onView("age")}
				/>
			</Group>

			<Group>
				<DeliveryValueList
					data-action={"edit feed delivery"}
					deliveryIn={feed.query?.filter?.deliveryIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.filter?.deliveryIn ?? []).length > 0
								? "neutral"
								: "secondary",
					}}
					onClick={() => onView("delivery")}
				/>
			</Group>

			<Group>
				<WarrantyValueList
					data-action={"edit feed warranty"}
					warrantyIn={feed.query?.filter?.warrantyIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone":
							(feed.query?.filter?.warrantyIn ?? []).length > 0
								? "neutral"
								: "secondary",
					}}
					onClick={() => onView("warranty")}
				/>
			</Group>

			<Group>
				<TitleValue
					data-action={"edit feed title"}
					title={feed.query?.filter?.title ?? null}
					textLabel={translator.text("Feed title (label)")}
					textEmpty={translator.text("Feed title not filled")}
					textHint={translator.text("Feed title (hint)")}
					action={
						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
						/>
					}
					wrapperProps={{
						"data-ui-tone": feed.query?.filter?.title ? "neutral" : "secondary",
					}}
					onClick={() => onView("title")}
				/>
			</Group>

			{children}
		</Container>
	);
};
