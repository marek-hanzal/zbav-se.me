import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { AgeValue } from "~/app/@common/age/ui/AgeValue";
import { CategoryValue } from "~/app/@common/category/ui/CategoryValue";
import { ConditionValue } from "~/app/@common/condition/ui/ConditionValue";
import { ExpireAtValue } from "~/app/@common/expire-at/ui/ExpireAtValue";
import { GalleryValue } from "~/app/@common/gallery/ui/GalleryValue";
import { LocationValue } from "~/app/@common/location/ui/LocationValue";
import { PriceValue } from "~/app/@common/price/ui/PriceValue";
import { PriceTypeValue } from "~/app/@common/price-type/ui/PriceTypeValue";
import { TitleValue } from "~/app/@common/title/ui/TitleValue";
import type { DraftEditor } from "~/app/@seller-user/draft/ui/DraftEditor";
import { ChevronAction } from "~/app/@seller-user/draft/ui/draft-editor/ChevronAction";

export namespace RequiredFieldsSection {
	export interface Props {
		draft: tDraft;
		onView(view: DraftEditor.View): void;
	}
}

export const RequiredFieldsSection: FC<RequiredFieldsSection.Props> = ({ draft, onView }) => {
	return (
		<>
			<Group>
				<GalleryValue
					uploads={draft.gallery.items.map((item) => item.upload)}
					label={translator.text("Listing photo gallery (label)")}
					onClick={() => onView("gallery")}
				/>
			</Group>

			<Tx
				label={translator.text("Draft - bunch of required (title)")}
				ui={{
					tone: "brand",
					theme: "light",
					text: "md",
					color: "lead",
					opacity: "low",
				}}
				className={"text-center"}
			/>

			<Group>
				<TitleValue
					title={draft.title}
					textLabel={translator.text("Listing title (label)")}
					textEmpty={translator.text("Listing title not filled")}
					action={<ChevronAction />}
					onClick={() => onView("title")}
					wrapperProps={{
						ui: {
							tone: draft.title ? "neutral" : "primary",
						},
					}}
				/>

				<CategoryValue
					category={draft.category}
					action={<ChevronAction />}
					onClick={() => onView("category")}
					wrapperProps={{
						ui: {
							tone: draft.categoryId ? "neutral" : "primary",
						},
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
					action={<ChevronAction />}
					onClick={() => onView("location")}
				/>
			</Group>

			<Group>
				<PriceValue
					price={draft.price}
					currency={draft.currency}
					action={<ChevronAction />}
					onClick={() => onView("price")}
					wrapperProps={{
						ui: {
							tone: draft.price !== null ? "neutral" : "primary",
						},
					}}
				/>

				<PriceTypeValue
					priceType={draft.priceType}
					action={<ChevronAction />}
					onClick={() => onView("priceType")}
					wrapperProps={{
						ui: {
							tone: draft.priceType ? "neutral" : "primary",
						},
					}}
				/>
			</Group>

			<Group>
				<ExpireAtValue
					expiresAt={draft.expiresAt}
					action={<ChevronAction />}
					onClick={() => onView("expireAt")}
					wrapperProps={{
						ui: {
							tone: draft.expiresAt ? "neutral" : "primary",
						},
					}}
				/>
			</Group>

			<Group>
				<ConditionValue
					condition={draft.condition}
					action={<ChevronAction />}
					onClick={() => onView("condition")}
					wrapperProps={{
						ui: {
							tone: draft.condition !== null ? "neutral" : "secondary",
						},
					}}
				/>

				<AgeValue
					age={draft.age}
					action={<ChevronAction />}
					onClick={() => onView("age")}
					wrapperProps={{
						ui: {
							tone: draft.age !== null ? "neutral" : "secondary",
						},
					}}
				/>
			</Group>
		</>
	);
};
