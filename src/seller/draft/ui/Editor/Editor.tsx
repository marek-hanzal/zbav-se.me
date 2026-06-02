import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { handleArrowNav } from "@/lib/client/nav";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { CategoryValue } from "~/common/category/ui/CategoryValue";
import { DeliveryValueList } from "~/common/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { PriceTypeValue } from "~/common/price-type/ui/PriceTypeValue";
import { TitleValue } from "~/common/title/ui/TitleValue";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { TitleContainer } from "~/common/ui/container";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { AgeValue } from "~/user/draft/ui/value/AgeValue";
import { ConditionValue } from "~/user/draft/ui/value/ConditionValue";
import { ConsValueList } from "~/user/draft/ui/value/ConsValueList";
import { DescriptionValue } from "~/user/draft/ui/value/DescriptionValue";
import { ExpiresValue } from "~/user/draft/ui/value/ExpiresValue";
import { PriceValue } from "~/user/draft/ui/value/PriceValue";
import { ProsValueList } from "~/user/draft/ui/value/ProsValueList";
import { RestrictionValue } from "~/user/draft/ui/value/RestrictionValue";
import { WarrantyValue } from "~/user/draft/ui/value/WarrantyValue";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { AttrOptional } from "./AttrOptional";
import { AttrRecommended } from "./AttrRecommended";
import { DeleteButton } from "./DeleteButton";
import { PublishListingButton } from "./PublishListingButton";

export namespace Editor {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		draftId: string;
		view: useView.Use<
			| "gallery"
			| "title"
			| "category"
			| "location"
			| "priceType"
			| "expires"
			| "price"
			| "age"
			| "pros"
			| "cons"
			| "delivery"
			| "description"
			| "warranty"
			| "restriction"
			| "condition"
		>;
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, draftId, view, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const { data: draft } = withDraftQuery.useFetchQuery(draftId);

	return (
		<TitleContainer
			data-ui={"EditorPage"}
			textTitle={translator.text("Listing editor (title)")}
			left={
				<BackHomeButton
					id={"back-link"}
					to="/$locale/app/home"
					params={{
						locale,
					}}
					//
					data-arrow-right={"home-link"}
					onKeyDown={handleArrowNav}
				/>
			}
			right={
				<HomeMenuButton
					id={"home-link"}
					//
					data-arrow-left={"back-link"}
					onKeyDown={handleArrowNav}
				/>
			}
			data-ui-layout={"vertical-header-content"}
			{...props}
		>
			<Container
				data-ui-inner={"default"}
				data-ui-flow={"vertical"}
				data-ui-gap={"lg"}
			>
				<Group>
					<CurrentRestriction _suspense={_suspense} />
				</Group>

				<Group>
					<GalleryValue
						data-action={"set draft gallery"}
						urls={draft.withImageUrl}
						label={translator.text("Listing photo gallery (label)")}
						onClick={() => view.set("gallery")}
					/>
				</Group>

				<Tx
					label="Draft - bunch of required (title)"
					data-ui-tone="brand"
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
						<TitleValue
							data-action={"set draft title"}
							title={draft.title}
							textLabel={translator.text("Listing title (label)")}
							textEmpty={translator.text("Listing title not filled")}
							action={<ChevronAction />}
							onClick={() => view.set("title")}
						/>

						<CategoryValue
							data-action={"select draft category"}
							category={draft.category}
							action={<ChevronAction />}
							onClick={() => view.set("category")}
						/>
					</Group>

					<Group>
						<LocationValue
							data-action={"select draft location"}
							location={draft.location}
							textLabel={translator.text("Listing location (label)")}
							textEmpty={translator.text("Listing location not selected")}
							textHint={translator.text("Listing location (hint)")}
							action={<ChevronAction />}
							onClick={() => view.set("location")}
						/>
					</Group>

					<Group>
						<PriceTypeValue
							data-action={"set draft price type"}
							priceType={draft.priceType}
							action={<ChevronAction />}
							onClick={() => view.set("priceType")}
						/>

						{match(draft.priceType)
							.with("fixed", "haggle", () => {
								return (
									<PriceValue
										data-action={"set draft price"}
										price={draft.price}
										currency={draft.currency}
										action={<ChevronAction />}
										onClick={() => view.set("price")}
									/>
								);
							})
							.with("free", "ask", "haulaway", null, undefined, () => {
								return (
									<PriceValue
										price={0}
										currency={"CZK"}
										action={<ChevronAction />}
										data-ui-disabled
									/>
								);
							})
							.exhaustive()}
					</Group>

					<Group>
						<ExpiresValue
							data-action={"set draft expiration date"}
							expires={draft.expires}
							action={<ChevronAction />}
							onClick={() => view.set("expires")}
						/>
					</Group>
				</Container>

				<Tx
					label="Draft - those others (title)"
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
						<DeliveryValueList
							deliveryIn={draft.delivery}
							action={<ChevronAction />}
							onClick={() => view.set("delivery")}
							wrapperProps={{
								"data-ui-tone": draft.delivery.length > 0 ? "neutral" : "secondary",
							}}
						/>
					</Group>

					<Group>
						<DescriptionValue
							description={draft.description}
							action={<ChevronAction />}
							onClick={() => view.set("description")}
						/>
					</Group>

					<Group>
						<ProsValueList
							pros={draft.pros}
							action={<ChevronAction />}
							onClick={() => view.set("pros")}
						/>

						<ConsValueList
							cons={draft.cons}
							action={<ChevronAction />}
							onClick={() => view.set("cons")}
						/>
					</Group>

					<Group>
						<WarrantyValue
							warranty={draft.warranty}
							action={<ChevronAction />}
							onClick={() => view.set("warranty")}
						/>
					</Group>

					<Group>
						<ConditionValue
							condition={draft.condition}
							action={<ChevronAction />}
							onClick={() => view.set("condition")}
						/>

						<AgeValue
							age={draft.age}
							action={<ChevronAction />}
							onClick={() => view.set("age")}
						/>
					</Group>

					<Group>
						<RestrictionValue
							data-ui={"set draft restriction"}
							restriction={draft.restriction}
							action={<ChevronAction />}
							data-ui-disabled={!draft.categoryId}
							onClick={() => view.set("restriction")}
						/>
					</Group>
				</Container>

				<AttrRecommended
					_suspense={"I know"}
					draftId={draft.id}
					categoryId={draft.categoryId}
					view={view}
				/>

				<AttrOptional
					_suspense={"I know"}
					draftId={draft.id}
					categoryId={draft.categoryId}
					view={view}
				/>

				<Tx
					label="Draft - action section (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Group>
					<PublishListingButton
						_suspense={_suspense}
						draft={draft}
						data-ui-round={undefined}
						data-ui-border={false}
						data-ui-shadow={false}
						data-ui-inner="lg"
					/>

					<LinkTo
						to={"/$locale/app/home"}
						params={{
							locale,
						}}
						icon={"icon-[solar--alarm-linear]"}
						iconProps={{
							"data-ui-text": "2xl",
						}}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-inner="lg"
						data-ui-background="default"
						data-ui-border={false}
						data-ui-shadow={false}
					>
						<Container
							data-ui-flow="vertical"
							data-ui-height="full"
						>
							<Tx label="Close draft (button)" />

							<Tx
								label="Close draft (hint)"
								data-ui-text="xs"
								data-ui-color="icon"
							/>
						</Container>
					</LinkTo>

					<DeleteButton
						draft={draft}
						buttonProps={{
							"data-ui-round": undefined,
							"data-ui-border": false,
							"data-ui-shadow": false,
							"data-ui-inner": "lg",
						}}
						confirmProps={{
							"data-ui-round": undefined,
							"data-ui-shadow": false,
							"data-ui-border": false,
							"data-ui-inner": "lg",
						}}
					/>
				</Group>
			</Container>
		</TitleContainer>
	);
};
