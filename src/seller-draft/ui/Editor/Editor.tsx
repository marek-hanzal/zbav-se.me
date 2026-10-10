import type { FC } from "react";
import { match } from "ts-pattern";
import { ChevronAction } from "~/application-ui/ui/ChevronAction";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { CategoryValue } from "~/category/ui/CategoryValue";
import { DeliveryValueList } from "~/delivery/ui/DeliveryValueList";
import { GalleryValue } from "~/gallery/ui/GalleryValue";
import { useLocale } from "~/locale/hook/useLocale";
import { LocationValue } from "~/location/ui/LocationValue";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { handleArrowNavFn } from "~/navigation/fn/handleArrowNavFn";
import { PriceTypeValue } from "~/price-type/ui/PriceTypeValue";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import { AttrOptional } from "~/seller-draft/ui/Editor/AttrOptional";
import { AttrRecommended } from "~/seller-draft/ui/Editor/AttrRecommended";
import { DeleteButton } from "~/seller-draft/ui/Editor/DeleteButton";
import { PublishListingButton } from "~/seller-draft/ui/Editor/PublishListingButton";
import { TitleValue } from "~/title/ui/TitleValue";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LinkTo } from "~/ui/ui/LinkTo";
import { AgeValue } from "~/user-draft/ui/AgeValue";
import { ConditionValue } from "~/user-draft/ui/ConditionValue";
import { ConsValueList } from "~/user-draft/ui/ConsValueList";
import { DescriptionValue } from "~/user-draft/ui/DescriptionValue";
import { ExpiresValue } from "~/user-draft/ui/ExpiresValue";
import { PriceValue } from "~/user-draft/ui/PriceValue";
import { ProsValueList } from "~/user-draft/ui/ProsValueList";
import { RestrictionValue } from "~/user-draft/ui/RestrictionValue";
import { WarrantyValue } from "~/user-draft/ui/WarrantyValue";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";
import { CurrentRestriction } from "~/user-restriction/ui/CurrentRestriction";
import type { useView } from "~/view/hook/useView";

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
			data-ui={"DraftEditor[TitleContainer]"}
			textTitle={translator.textFn("Listing editor (title)")}
			left={
				<BackHomeButton
					id={"back-link"}
					to="/$locale/app/home"
					params={{
						locale,
					}}
					//
					data-arrow-right={"home-link"}
					onKeyDown={handleArrowNavFn}
				/>
			}
			right={
				<HomeMenuButton
					id={"home-link"}
					//
					data-arrow-left={"back-link"}
					onKeyDown={handleArrowNavFn}
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
						label={translator.textFn("Listing photo gallery (label)")}
						onClick={() => view.setFn("gallery")}
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
							textLabel={translator.textFn("Listing title (label)")}
							textEmpty={translator.textFn("Listing title not filled")}
							action={<ChevronAction />}
							onClick={() => view.setFn("title")}
						/>

						<CategoryValue
							data-action={"select draft category"}
							category={draft.category}
							action={<ChevronAction />}
							onClick={() => view.setFn("category")}
						/>
					</Group>

					<Group>
						<LocationValue
							data-action={"select draft location"}
							location={draft.location}
							textLabel={translator.textFn("Listing location (label)")}
							textEmpty={translator.textFn("Listing location not selected")}
							textHint={translator.textFn("Listing location (hint)")}
							action={<ChevronAction />}
							onClick={() => view.setFn("location")}
						/>
					</Group>

					<Group>
						<PriceTypeValue
							data-action={"set draft price type"}
							priceType={draft.priceType}
							action={<ChevronAction />}
							onClick={() => view.setFn("priceType")}
						/>

						{match(draft.priceType)
							.with("fixed", "haggle", () => {
								return (
									<PriceValue
										data-action={"set draft price"}
										price={draft.price}
										currency={draft.currency}
										action={<ChevronAction />}
										onClick={() => view.setFn("price")}
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
							onClick={() => view.setFn("expires")}
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
							onClick={() => view.setFn("delivery")}
							wrapperProps={{
								"data-ui-tone": draft.delivery.length > 0 ? "neutral" : "secondary",
							}}
						/>
					</Group>

					<Group>
						<DescriptionValue
							description={draft.description}
							action={<ChevronAction />}
							onClick={() => view.setFn("description")}
						/>
					</Group>

					<Group>
						<ProsValueList
							pros={draft.pros}
							action={<ChevronAction />}
							onClick={() => view.setFn("pros")}
						/>

						<ConsValueList
							cons={draft.cons}
							action={<ChevronAction />}
							onClick={() => view.setFn("cons")}
						/>
					</Group>

					<Group>
						<WarrantyValue
							warranty={draft.warranty}
							action={<ChevronAction />}
							onClick={() => view.setFn("warranty")}
						/>
					</Group>

					<Group>
						<ConditionValue
							condition={draft.condition}
							action={<ChevronAction />}
							onClick={() => view.setFn("condition")}
						/>

						<AgeValue
							age={draft.age}
							action={<ChevronAction />}
							onClick={() => view.setFn("age")}
						/>
					</Group>

					<Group>
						<RestrictionValue
							data-ui={"DraftEditor-[RestrictionValue]"}
							restriction={draft.restriction}
							action={<ChevronAction />}
							data-ui-disabled={!draft.categoryId}
							onClick={() => view.setFn("restriction")}
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
