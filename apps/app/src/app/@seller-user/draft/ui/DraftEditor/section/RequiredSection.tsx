import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { ExpireAtValue } from "~/app/@common/expire-at/ui/ExpireAtValue";
import { PriceValue } from "~/app/@common/price/ui/PriceValue";
import { PriceTypeValue } from "~/app/@common/price-type/ui/PriceTypeValue";
import { RestrictionValue } from "~/app/@common/restriction/ui/RestrictionValue";
import { TitleValue } from "~/app/@common/title/ui/TitleValue";
import { ChevronAction } from "~/app/@seller-user/draft/ui/DraftEditor/ChevronAction";
import type { Data } from "~/app/@seller-user/draft/ui/DraftEditor/Data";
import { CategoryValue } from "~/app/@session/category/ui/CategoryValue";
import { GalleryValue } from "~/app/v0/@common/gallery/ui/GalleryValue";
import { LocationValue } from "~/app/v0/@common/location/ui/LocationValue";

export namespace RequiredSection {
	export interface Props {
		draft: tDraft;
		onView(view: Data.View): void;
	}
}

export const RequiredSection: FC<RequiredSection.Props> = ({ draft, onView }) => {
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
				label="Draft - bunch of required (title)"
				ui={{
					tone: "brand",
					theme: "light",
					text: "md",
					color: "lead",
					opacity: "8",
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
					categoryId={draft.categoryId}
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
				<RestrictionValue
					restriction={draft.restriction}
					action={<ChevronAction />}
					onClick={() => onView("restriction")}
					wrapperProps={{
						ui: {
							tone: draft.restriction ? "neutral" : "primary",
						},
					}}
				/>
			</Group>
		</>
	);
};
