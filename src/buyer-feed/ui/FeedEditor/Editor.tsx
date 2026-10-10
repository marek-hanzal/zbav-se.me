import { type FC, Suspense } from "react";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { AgeValueList } from "~/buyer-feed/ui/FeedEditor/AgeValueList";
import { AttrValues } from "~/buyer-feed/ui/FeedEditor/AttrValues";
import { CategoryValueList } from "~/buyer-feed/ui/FeedEditor/CategoryValueList";
import { ConditionValueList } from "~/buyer-feed/ui/FeedEditor/ConditionValueList";
import { NameValue } from "~/buyer-feed/ui/FeedEditor/NameValue";
import { PriceMaxValue } from "~/buyer-feed/ui/FeedEditor/PriceMaxValue";
import { PriceMinValue } from "~/buyer-feed/ui/FeedEditor/PriceMinValue";
import { RangeValue } from "~/buyer-feed/ui/FeedEditor/RangeValue";
import { SortValue } from "~/buyer-feed/ui/FeedEditor/SortValue";
import { WarrantyValueList } from "~/buyer-feed/ui/FeedEditor/WarrantyValueList";
import { DeliveryValueList } from "~/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/gallery/ui/GalleryValue";
import { ListingStatusValueList } from "~/listing/ui/ListingStatusValueList";
import { LocationValue } from "~/location/ui/LocationValue";
import { PriceTypeList } from "~/price-type/ui/PriceTypeList";
import { withLocationQuery } from "~/session-location/query/withLocationQuery";
import { TitleValue } from "~/title/ui/TitleValue";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { Icon } from "~/ui/ui/Icon";
import { LabelValue } from "~/ui/ui/LabelValue";
import { CurrentRestriction } from "~/user-restriction/ui/CurrentRestriction";
import type { useView } from "~/view/hook/useView";

export { ListingStatusValueList } from "~/listing/ui/ListingStatusValueList";

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
						label={translator.textFn("Feed photo gallery (label)")}
						urls={
							feed.upload
								? [
										feed.upload?.url,
									]
								: []
						}
						onClick={() => view.setFn("gallery")}
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
						onClick={() => view.setFn("name")}
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
						textLabel={translator.textFn("Feed fulltext (label)")}
						textEmpty={translator.textFn("Feed fulltext not filled")}
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
						onClick={() => view.setFn("fulltext")}
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
						textLabel={translator.textFn("Feed category (label)")}
						textEmpty={translator.textFn("Feed category not selected")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.query?.where?.categoryId ? "neutral" : "secondary",
						}}
						onClick={() => view.setFn("category")}
					/>
				</Group>

				<Group>
					<LocationValue
						data-action={"edit feed location"}
						location={location}
						textLabel={translator.textFn("Feed location (label)")}
						textEmpty={translator.textFn("Feed location not selected")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": locationId ? "neutral" : "secondary",
						}}
						onClick={() => view.setFn("location")}
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
						onClick={() => view.setFn("range")}
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
						onClick={() => view.setFn("status")}
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
						onClick={() => view.setFn("delivery")}
					/>
				</Group>

				<Group>
					<TitleValue
						data-action={"edit feed title"}
						title={feed.query?.where?.title ?? null}
						textLabel={translator.textFn("Feed title (label)")}
						textEmpty={translator.textFn("Feed title not filled")}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						wrapperProps={{
							"data-ui-tone": feed.query?.where?.title ? "neutral" : "secondary",
						}}
						onClick={() => view.setFn("title")}
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
						onClick={() => view.setFn("priceType")}
					/>

					<PriceMinValue
						value={feed.query.where?.priceMin}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.setFn("priceMin")}
					/>

					<PriceMaxValue
						value={feed.query.where?.priceMax}
						action={
							<Icon
								icon={ChevronRightIcon}
								data-ui-text="xl"
							/>
						}
						onClick={() => view.setFn("priceMax")}
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
						onClick={() => view.setFn("warranty")}
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
						onClick={() => view.setFn("condition")}
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
						onClick={() => view.setFn("age")}
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
						onClick={() => view.setFn("sort")}
					/>
				</Group>
			</Container>

			{children}
		</Container>
	);
};
