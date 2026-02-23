import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
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
import type { DraftEditorView } from "~/app/@seller-user/draft/ui/draft-editor/type";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace DraftEditorDefaultView {
	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
		onView(view: DraftEditorView): void;
	}
}

const Chevron = () => (
	<Icon
		icon={ChevronRightIcon}
		ui={{
			text: "xl",
		}}
	/>
);

export const DraftEditorDefaultView: FC<DraftEditorDefaultView.Props> = ({
	draft,
	onListing,
	onDelete,
	onView,
}) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Draft edit (title)")}
			right={<HomeMenuButton />}
		>
			<Container
				data-ui={"DraftEditor-[Container.content]"}
				ui={{
					flow: "vertical",
					inner: "default",
					width: "full",
					gap: "lg",
				}}
			>
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
						action={<Chevron />}
						onClick={() => onView("title")}
						wrapperProps={{
							ui: {
								tone: draft.title ? "neutral" : "primary",
							},
						}}
					/>

					<CategoryValue
						category={draft.category}
						action={<Chevron />}
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
						action={<Chevron />}
						onClick={() => onView("location")}
					/>
				</Group>

				<Group>
					<PriceValue
						price={draft.price}
						currency={draft.currency}
						action={<Chevron />}
						onClick={() => onView("price")}
						wrapperProps={{
							ui: {
								tone: draft.price !== null ? "neutral" : "primary",
							},
						}}
					/>

					<PriceTypeValue
						priceType={draft.priceType}
						action={<Chevron />}
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
						action={<Chevron />}
						onClick={() => onView("expireAt")}
						wrapperProps={{
							ui: {
								tone: draft.expiresAt ? "neutral" : "primary",
							},
						}}
					/>
				</Group>

				<Tx
					label={translator.text("Draft - those others (title)")}
					ui={{
						tone: "secondary",
						theme: "light",
						text: "md",
						color: "lead",
						opacity: "low",
					}}
					className={"text-center"}
				/>

				<Group>
					<DescriptionValue
						description={draft.description}
						action={<Chevron />}
						onClick={() => onView("description")}
						wrapperProps={{
							ui: {
								tone: draft.description ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Group>
					<ProsValueList
						pros={draft.pros ?? []}
						action={<Chevron />}
						onClick={() => onView("pros")}
						wrapperProps={{
							ui: {
								tone: (draft.pros ?? []).length > 0 ? "neutral" : "secondary",
							},
						}}
					/>

					<ConsValueList
						cons={draft.cons ?? []}
						action={<Chevron />}
						onClick={() => onView("cons")}
						wrapperProps={{
							ui: {
								tone: (draft.cons ?? []).length > 0 ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Group>
					<DeliveryValueList
						deliveryIn={draft.delivery ?? []}
						action={<Chevron />}
						onClick={() => onView("delivery")}
						wrapperProps={{
							ui: {
								tone: (draft.delivery ?? []).length > 0 ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Group>
					<WarrantyValue
						warranty={draft.warranty}
						action={<Chevron />}
						onClick={() => onView("warranty")}
						wrapperProps={{
							ui: {
								tone: draft.warranty ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Group>
					<ConditionValue
						condition={draft.condition}
						action={<Chevron />}
						onClick={() => onView("condition")}
						wrapperProps={{
							ui: {
								tone: draft.condition !== null ? "neutral" : "secondary",
							},
						}}
					/>

					<AgeValue
						age={draft.age}
						action={<Chevron />}
						onClick={() => onView("age")}
						wrapperProps={{
							ui: {
								tone: draft.age !== null ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Group>
					<RestrictionValue
						restriction={draft.restriction}
						action={<Chevron />}
						onClick={() => onView("restriction")}
						wrapperProps={{
							ui: {
								tone: draft.restriction ? "neutral" : "secondary",
							},
						}}
					/>
				</Group>

				<Tx
					label={translator.text("Draft - action section (title)")}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "md",
						color: "lead",
						opacity: "low",
					}}
					className={"text-center"}
				/>

				<Group>
					<CreateListingButton
						draft={draft}
						onListing={onListing}
						ui={{
							round: undefined,
							shadow: false,
							inner: "lg",
						}}
					/>

					<LinkTo
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
						icon={"icon-[solar--alarm-linear]"}
						iconProps={{
							ui: {
								text: "2xl",
							},
						}}
						ui={{
							tone: "neutral",
							theme: "light",
							inner: "lg",
							background: "default",
							border: false,
							shadow: false,
						}}
					>
						<Container
							ui={{
								flow: "vertical",
								height: "full",
							}}
						>
							<Tx label={translator.text("Close draft (button)")} />

							<Tx
								label={translator.text("Close draft (hint)")}
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
						buttonProps={{
							ui: {
								round: undefined,
								border: false,
								shadow: false,
								inner: "lg",
							},
						}}
						confirmProps={{
							ui: {
								round: undefined,
								shadow: false,
								border: false,
								inner: "lg",
							},
						}}
					/>
				</Group>
			</Container>
		</TitleContainer>
	);
};
