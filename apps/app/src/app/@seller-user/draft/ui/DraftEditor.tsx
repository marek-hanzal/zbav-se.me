import { useLocale } from "@use-pico/client/hook";
import { EditIcon, Icon, SaveIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { AgeValue } from "~/app/@common/age/ui/AgeValue";
import { CategoryValue } from "~/app/@common/category/ui/CategoryValue";
import { ConditionValue } from "~/app/@common/condition/ui/ConditionValue";
import { ConsValueList } from "~/app/@common/cons/ui/ConsValueList";
import { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import { DescriptionValue } from "~/app/@common/description/ui/DescriptionValue";
import { ExpireAtValue } from "~/app/@common/expire-at/ui/ExpireAtValue";
import { GalleryValue } from "~/app/@common/gallery/ui/GalleryValue";
import { LocationValue } from "~/app/@common/location/ui/LocationValue";
import { PriceValue } from "~/app/@common/price/ui/PriceValue";
import { PriceTypeValue } from "~/app/@common/price-type/ui/PriceTypeValue";
import { ProsValueList } from "~/app/@common/pros/ui/ProsValueList";
import { RestrictionValue } from "~/app/@common/restriction/ui/RestrictionValue";
import { TitleValue } from "~/app/@common/title/ui/TitleValue";
import { WarrantyValue } from "~/app/@common/warranty/ui/WarrantyValue";
import { CreateListingButton } from "~/app/@seller-user/draft/ui/button/CreateListingButton";
import { DeleteButton } from "~/app/@seller-user/draft/ui/button/DeleteButton";
import { AgePatch } from "~/app/@seller-user/draft/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/@seller-user/draft/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/@seller-user/draft/ui/patch/ConditionPatch";
import { ConsPatch } from "~/app/@seller-user/draft/ui/patch/ConsPatch";
import { DeliveryPatch } from "~/app/@seller-user/draft/ui/patch/DeliveryPatch";
import { DescriptionPatch } from "~/app/@seller-user/draft/ui/patch/DescriptionPatch";
import { ExpireAtPatch } from "~/app/@seller-user/draft/ui/patch/ExpireAtPatch";
import { GalleryPatch } from "~/app/@seller-user/draft/ui/patch/GalleryPatch";
import { LocationPatch } from "~/app/@seller-user/draft/ui/patch/LocationPatch";
import { PricePatch } from "~/app/@seller-user/draft/ui/patch/PricePatch";
import { PriceTypePatch } from "~/app/@seller-user/draft/ui/patch/PriceTypePatch";
import { ProsPatch } from "~/app/@seller-user/draft/ui/patch/ProsPatch";
import { RestrictionPatch } from "~/app/@seller-user/draft/ui/patch/RestrictionPatch";
import { TitlePatch } from "~/app/@seller-user/draft/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/@seller-user/draft/ui/patch/WarrantyPatch";

export namespace DraftEditor {
	export type View =
		| "default"
		| "title"
		| "location"
		| "price"
		| "priceType"
		| "category"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "restriction"
		| "gallery"
		| "expireAt"
		| "description"
		| "pros"
		| "cons";

	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
	}
}

export const DraftEditor: FC<DraftEditor.Props> = ({ draft, onListing, onDelete }) => {
	const locale = useLocale();
	const [view, setView] = useState<DraftEditor.View>("default");

	return (
		<View<DraftEditor.View, TitleContainer.Props>
			state={{
				value: view,
				set: setView,
			}}
			views={{
				default: {
					children: (
						<TitleContainer textTitle={"Draft edit (title)"}>
							<Container
								data-ui={"DraftEditor-[Container.content]"}
								ui={{
									flow: "vertical",
									inner: "default",
									width: "full",
									gap: "lg",
								}}
							>
								<GalleryValue
									uploads={draft.gallery.items.map((item) => item.upload)}
									label={translator.text("Listing photo gallery (label)")}
									onClick={() => setView("gallery")}
								/>

								<Tx
									label={"Draft - bunch of required (title)"}
									ui={{
										tone: "brand",
										theme: "light",
										text: "md",
										color: "lead",
										opacity: "low",
									}}
									className={"text-center"}
								/>

								<TitleValue
									title={draft.title}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("title");
									}}
								/>

								<CategoryValue
									category={draft.category}
									onClick={() => {
										setView("category");
									}}
								/>

								<LocationValue
									locationId={draft.locationId}
									textLabel={translator.text("Listing location (label)")}
									textEmpty={translator.text("Listing location not selected")}
									textHint={translator.text("Listing location (hint)")}
									wrapperProps={{
										ui: {
											tone: draft.locationId ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("location");
									}}
								/>

								<PriceValue
									price={draft.price}
									currency={draft.currency}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("price");
									}}
								/>

								<PriceTypeValue
									priceType={draft.priceType}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("priceType");
									}}
								/>

								<ExpireAtValue
									expiresAt={draft.expiresAt}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("expireAt");
									}}
								/>

								<Tx
									label={"Draft - those others (title)"}
									ui={{
										tone: "secondary",
										theme: "light",
										text: "md",
										color: "lead",
										opacity: "low",
									}}
									className={"text-center"}
								/>

								<DescriptionValue
									description={draft.description}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("description");
									}}
								/>

								<ProsValueList
									pros={draft.pros ?? []}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("pros");
									}}
								/>

								<ConsValueList
									cons={draft.cons ?? []}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("cons");
									}}
								/>

								<DeliveryValueList
									deliveryIn={draft.delivery ?? []}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
								/>

								<WarrantyValue
									warranty={draft.warranty}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("warranty");
									}}
								/>

								<RestrictionValue
									restriction={draft.restriction}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("restriction");
									}}
								/>

								<ConditionValue
									condition={draft.condition}
									onClick={() => {
										setView("condition");
									}}
								/>

								<AgeValue
									age={draft.age}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									onClick={() => {
										setView("age");
									}}
								/>

								<Tx
									label={"Draft - action section (title)"}
									ui={{
										tone: "neutral",
										theme: "light",
										text: "md",
										color: "lead",
										opacity: "low",
									}}
									className={"text-center"}
								/>

								<CreateListingButton
									draft={draft}
									onListing={onListing}
								/>

								<LinkTo
									to={"/$locale/ui/seller"}
									params={{
										locale,
									}}
									icon={SaveIcon}
									iconProps={{
										ui: {
											text: "2xl",
										},
									}}
									ui={{
										tone: "neutral",
										theme: "light",
										size: "default",
										background: "default",
										round: "default",
										border: true,
										shadow: true,
									}}
								>
									<Container
										ui={{
											flow: "vertical",
											height: "full",
										}}
									>
										<Tx label="Close draft (button)" />

										<Tx
											label="Close draft (hint)"
											ui={{
												text: "xs",
												color: "icon",
											}}
										/>
									</Container>
								</LinkTo>

								<DeleteButton
									draft={draft}
									onDelete={onDelete}
								/>
							</Container>
						</TitleContainer>
					),
				},
				title: {
					children: (
						<TitlePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				location: {
					children: (
						<LocationPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				price: {
					children: (
						<PricePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				priceType: {
					children: (
						<PriceTypePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				category: {
					children: (
						<CategoryPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				condition: {
					children: (
						<ConditionPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				age: {
					children: (
						<AgePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				delivery: {
					children: (
						<DeliveryPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				warranty: {
					children: (
						<WarrantyPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				restriction: {
					children: (
						<RestrictionPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				expireAt: {
					children: (
						<ExpireAtPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				gallery: {
					children: (
						<GalleryPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSuccess={() => setView("default")}
							defaultUploadIds={draft.gallery.items.map((item) => item.uploadId)}
						/>
					),
				},
				description: {
					children: (
						<DescriptionPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				pros: {
					children: (
						<ProsPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				cons: {
					children: (
						<ConsPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
			}}
		>
			{({ content }) => {
				return content;
			}}
		</View>
	);
};
