import { useLocale } from "@use-pico/client/hook";
import { SaveIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-session";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { CreateListingButton } from "~/app/draft/button/CreateListingButton";
import { DeleteButton } from "~/app/draft/button/DeleteButton";
import { AgePatch } from "~/app/draft/patch/AgePatch";
import { CategoryPatch } from "~/app/draft/patch/CategoryPatch";
import { ConditionPatch } from "~/app/draft/patch/ConditionPatch";
import { ConsPatch } from "~/app/draft/patch/ConsPatch";
import { DeliveryPatch } from "~/app/draft/patch/DeliveryPatch";
import { DescriptionPatch } from "~/app/draft/patch/DescriptionPatch";
import { ExpireAtPatch } from "~/app/draft/patch/ExpireAtPatch";
import { GalleryPatch } from "~/app/draft/patch/GalleryPatch";
import { LocationPatch } from "~/app/draft/patch/LocationPatch";
import { PricePatch } from "~/app/draft/patch/PricePatch";
import { PriceTypePatch } from "~/app/draft/patch/PriceTypePatch";
import { ProsPatch } from "~/app/draft/patch/ProsPatch";
import { TitlePatch } from "~/app/draft/patch/TitlePatch";
import { WarrantyPatch } from "~/app/draft/patch/WarrantyPatch";
import { AgeValue } from "~/app/draft/value/AgeValue";
import { CategoryValue } from "~/app/draft/value/CategoryValue";
import { ConditionValue } from "~/app/draft/value/ConditionValue";
import { ConsLabel } from "~/app/draft/value/ConsLabel";
import { DeliveryValue } from "~/app/draft/value/DeliveryValue";
import { DescriptionValue } from "~/app/draft/value/DescriptionValue";
import { ExpireAtValue } from "~/app/draft/value/ExpireAtValue";
import { LocationValue } from "~/app/draft/value/LocationValue";
import { PriceTypeValue } from "~/app/draft/value/PriceTypeValue";
import { PriceValue } from "~/app/draft/value/PriceValue";
import { ProsLabel } from "~/app/draft/value/ProsLabel";
import { TitleValue } from "~/app/draft/value/TitleValue";
import { WarrantyValue } from "~/app/draft/value/WarrantyValue";
import { GalleryValue } from "~/app/gallery/ui/GalleryValue";

export namespace Setup {
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

export const Setup: FC<Setup.Props> = ({ draft, onListing, onDelete }) => {
	const locale = useLocale();
	const [view, setView] = useState<Setup.View>("default");

	return (
		<View<Setup.View, TitleContainer.Props>
			state={{
				value: view,
				set: setView,
			}}
			views={{
				default: {
					children: (
						<TitleContainer textTitle={"Draft edit (title)"}>
							<Container
								data-ui={"Setup-[Container.content]"}
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
									draft={draft}
									onClick={() => {
										setView("title");
									}}
								/>

								<CategoryValue
									draft={draft}
									onClick={() => {
										setView("category");
									}}
								/>

								<LocationValue
									draft={draft}
									onClick={() => {
										setView("location");
									}}
								/>

								<PriceValue
									draft={draft}
									onClick={() => {
										setView("price");
									}}
								/>

								<PriceTypeValue
									draft={draft}
									onClick={() => {
										setView("priceType");
									}}
								/>

								<ExpireAtValue
									draft={draft}
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
									draft={draft}
									onClick={() => {
										setView("description");
									}}
								/>

								<ProsLabel
									draft={draft}
									onClick={() => {
										setView("pros");
									}}
								/>

								<ConsLabel
									draft={draft}
									onClick={() => {
										setView("cons");
									}}
								/>

								<DeliveryValue
									draft={draft}
									onClick={() => {
										setView("delivery");
									}}
								/>

								<WarrantyValue
									draft={draft}
									onClick={() => {
										setView("warranty");
									}}
								/>

								<ConditionValue
									draft={draft}
									onClick={() => {
										setView("condition");
									}}
								/>

								<AgeValue
									draft={draft}
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
