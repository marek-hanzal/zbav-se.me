import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { DeliveryValueList } from "~/common/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { ListingStatusValueList } from "~/common/listing/ui/ListingStatusValueList";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { PriceTypeList } from "~/common/price-type/ui/PriceTypeList";
import { TitleValue } from "~/common/title/ui/TitleValue";
import { withLocationQuery } from "~/session/location/query/withLocationQuery";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { AttrValues } from "./AttrValues";
import { AgeValueList } from "./value/AgeValueList";
import { CategoryValueList } from "./value/CategoryValueList";
import { ConditionValueList } from "./value/ConditionValueList";
import { NameValue } from "./value/NameValue";
import { PriceMaxValue } from "./value/PriceMaxValue";
import { PriceMinValue } from "./value/PriceMinValue";
import { RangeValue } from "./value/RangeValue";
import { SortValue } from "./value/SortValue";
import { WarrantyValueList } from "./value/WarrantyValueList";

export { ListingStatusValueList } from "~/common/listing/ui/ListingStatusValueList";

export namespace Editor {
	export type Section = "header";

	export interface Props extends Omit<Container.Props, "hidden">, MarkSuspense.Props {
		feed: FeedSchema.Type;
		view: useView.Use<
			| "default"
			| "gallery"
			| "name"
			| "category"
			| "location"
			| "range"
			| "sort"
			| "condition"
			| "age"
			| "status"
			| "delivery"
			| "warranty"
			| "title"
			| "priceType"
			| "priceMin"
			| "priceMax"
			| "fulltext"
		>;
		hidden?: readonly Section[];
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, feed, view, hidden, children, ...props }) => {
	const translator = useTranslator();
	const locationId = feed.query?.meta?.locationId;
	const statusIn = feed.query?.where?.statusIn ?? [];
	const { data: location } = withLocationQuery.useMaybeEntityQuery({
		where: {
			id: feed.query?.meta?.locationId ?? "<nope>",
		},
	});

	return (
		<Container
			data-ui={"Editor"}
			data-ui-flow="vertical"
			data-ui-inner="default"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			<Group>
				<Suspense fallback={"is that you?"}>
					<CurrentRestriction _suspense={_suspense} />
				</Suspense>
			</Group>

			{hidden?.includes("header") ? null : (
				<Group>
					<GalleryValue
						data-action={"edit feed gallery"}
						label={translator.text("Feed photo gallery (label)")}
						urls={
							feed.upload
								? [
										feed.upload?.url,
									]
								: []
						}
						onClick={() => view.set("gallery")}
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
						onClick={() => view.set("name")}
					/>
				</Group>
			)}

			<Tx
				label="Feed - common stuff (title)"
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				<Group>
					<LabelValue
						data-action={"edit feed fulltext"}
						textLabel={translator.text("Feed fulltext (label)")}
						textEmpty={translator.text("Feed fulltext not filled")}
						textValue={feed.query?.where?.fulltext?.join(", ") || null}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.query?.where?.fulltext?.length
								? "neutral"
								: "secondary",
						}}
						onClick={() => view.set("fulltext")}
					/>
				</Group>

				<Group>
					<CategoryValueList
						_suspense={"I know"}
						data-action={"edit feed category"}
						categoryIdIn={
							feed.query?.where?.categoryId
								? [
										feed.query?.where?.categoryId,
									]
								: []
						}
						textLabel={translator.text("Feed category (label)")}
						textEmpty={translator.text("Feed category not selected")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.query?.where?.categoryId ? "neutral" : "secondary",
						}}
						onClick={() => view.set("category")}
					/>
				</Group>

				<Group>
					<LocationValue
						data-action={"edit feed location"}
						location={location}
						textLabel={translator.text("Feed location (label)")}
						textEmpty={translator.text("Feed location not selected")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": locationId ? "neutral" : "secondary",
						}}
						onClick={() => view.set("location")}
					/>

					<RangeValue
						data-action={"edit feed range"}
						range={feed.query?.where?.range}
						data-ui-disabled={!locationId}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone":
								!locationId || feed.query?.where?.range ? "neutral" : "secondary",
						}}
						onClick={() => view.set("range")}
					/>
				</Group>

				<Group>
					<ListingStatusValueList
						data-action={"edit feed status"}
						statusIn={statusIn}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": statusIn.length > 0 ? "neutral" : "secondary",
						}}
						onClick={() => view.set("status")}
					/>
				</Group>

				<Group>
					<DeliveryValueList
						data-action={"edit feed delivery"}
						deliveryIn={feed.query?.where?.deliveryIn ?? []}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone":
								(feed.query?.where?.deliveryIn ?? []).length > 0
									? "neutral"
									: "secondary",
						}}
						onClick={() => view.set("delivery")}
					/>
				</Group>

				<Group>
					<TitleValue
						data-action={"edit feed title"}
						title={feed.query?.where?.title ?? null}
						textLabel={translator.text("Feed title (label)")}
						textEmpty={translator.text("Feed title not filled")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.query?.where?.title ? "neutral" : "secondary",
						}}
						onClick={() => view.set("title")}
					/>
				</Group>
			</Container>

			<Tx
				label="Feed - rest (title)"
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				<Group>
					<PriceTypeList
						data-action={"edit feed warranty"}
						priceType={feed.query?.where?.priceTypeIn ?? []}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.set("priceType")}
					/>

					<PriceMinValue
						value={feed.query.where?.priceMin}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.set("priceMin")}
					/>

					<PriceMaxValue
						value={feed.query.where?.priceMax}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.set("priceMax")}
					/>
				</Group>

				<Group>
					<WarrantyValueList
						data-action={"edit feed warranty"}
						warrantyIn={feed.query?.where?.warrantyIn ?? []}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.set("warranty")}
					/>
				</Group>

				<Group>
					<ConditionValueList
						data-action={"edit feed condition"}
						conditionIn={feed.query?.where?.conditionIn ?? []}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone":
								(feed.query?.where?.conditionIn ?? []).length > 0
									? "neutral"
									: "secondary",
						}}
						onClick={() => view.set("condition")}
					/>

					<AgeValueList
						data-action={"edit feed age"}
						ageIn={feed.query?.where?.ageIn ?? []}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone":
								(feed.query?.where?.ageIn ?? []).length > 0
									? "neutral"
									: "secondary",
						}}
						onClick={() => view.set("age")}
					/>
				</Group>
			</Container>

			<AttrValues
				_suspense={_suspense}
				feed={feed}
				view={view}
			/>

			<Tx
				label="Feed - sorting (title)"
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
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
						onClick={() => view.set("sort")}
					/>
				</Group>
			</Container>

			{children}
		</Container>
	);
};
