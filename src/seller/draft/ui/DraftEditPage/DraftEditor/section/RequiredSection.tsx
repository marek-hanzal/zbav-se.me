import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { TitleValue } from "~/common/title/ui/TitleValue";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ChevronAction } from "../ChevronAction";
import type { DraftEditor } from "../DraftEditor";
import { CategoryValue } from "../value/CategoryValue";
import { ExpireAtValue } from "../value/ExpireAtValue";
import { PriceTypeValue } from "../value/PriceTypeValue";
import { PriceValue } from "../value/PriceValue";

export namespace RequiredSection {
	export interface Props extends MarkSuspense.Props {
		draft: DraftSchema.Type;
		onView(view: DraftEditor.View): void;
	}
}

export const RequiredSection: FC<RequiredSection.Props> = ({ _suspense, draft, onView }) => {
	return (
		<>
			<Group>
				<GalleryValue
					urls={draft.withImageUrl}
					label={translator.text("Listing photo gallery (label)")}
					onClick={() => onView("gallery")}
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

			<Group>
				<TitleValue
					data-action={"set listing title"}
					title={draft.title}
					textLabel={translator.text("Listing title (label)")}
					textEmpty={translator.text("Listing title not filled")}
					action={<ChevronAction />}
					onClick={() => onView("title")}
					wrapperProps={{
						"data-ui-tone": draft.title ? "neutral" : "primary",
					}}
				/>

				<CategoryValue
					data-action={"select listing category"}
					_suspense={"I know"}
					categoryId={draft.categoryId}
					action={<ChevronAction />}
					onClick={() => onView("category")}
					wrapperProps={{
						"data-ui-tone": draft.categoryId ? "neutral" : "primary",
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
						"data-ui-tone": draft.locationId ? "neutral" : "primary",
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
						"data-ui-tone": draft.price !== null ? "neutral" : "primary",
					}}
				/>

				<PriceTypeValue
					data-ui={"set listing price type"}
					priceType={draft.priceType}
					action={<ChevronAction />}
					onClick={() => onView("priceType")}
					wrapperProps={{
						"data-ui-tone": draft.priceType ? "neutral" : "primary",
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
						"data-ui-tone": draft.expiresAt ? "neutral" : "primary",
					}}
				/>
			</Group>
		</>
	);
};
