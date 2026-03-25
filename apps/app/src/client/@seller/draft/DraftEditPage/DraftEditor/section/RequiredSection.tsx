import type { MarkSuspense } from "@use-pico/client/type";
import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { GalleryValue } from "~/client/@common/gallery/ui/GalleryValue";
import { LocationValue } from "~/client/@common/location/ui/LocationValue";
import { TitleValue } from "~/client/@common/title/ui/TitleValue";
import { ChevronAction } from "../ChevronAction";
import type { DraftEditor } from "../DraftEditor";
import { CategoryValue } from "../value/CategoryValue";
import { ExpireAtValue } from "../value/ExpireAtValue";
import { PriceTypeValue } from "../value/PriceTypeValue";
import { PriceValue } from "../value/PriceValue";
import { RestrictionValue } from "../value/RestrictionValue";

export namespace RequiredSection {
	export interface Props extends MarkSuspense.Props {
		draft: tDraft;
		onView(view: DraftEditor.View): void;
	}
}

export const RequiredSection: FC<RequiredSection.Props> = ({ _suspense, draft, onView }) => {
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
					data-action={"set listing title"}
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
					data-action={"select listing category"}
					_suspense={"I know"}
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
					data-ui={"select listing location"}
					_suspense={"I know"}
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
					data-ui={"set listing price"}
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
					data-ui={"set listing price type"}
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
					data-ui={"set listing expiration date"}
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
					data-ui={"set listing restriction"}
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
