import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { ConsValueList } from "~/app/@common/cons/ui/ConsValueList";
import { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import { DescriptionValue } from "~/app/@common/description/ui/DescriptionValue";
import { ProsValueList } from "~/app/@common/pros/ui/ProsValueList";
import { RestrictionValue } from "~/app/@common/restriction/ui/RestrictionValue";
import { WarrantyValue } from "~/app/@common/warranty/ui/WarrantyValue";
import type { DraftEditor } from "~/app/@seller-user/draft/ui/DraftEditor";
import { ChevronAction } from "~/app/@seller-user/draft/ui/draft-editor/ChevronAction";

export namespace OptionalFieldsSection {
	export interface Props {
		draft: tDraft;
		onView(view: DraftEditor.View): void;
	}
}

export const OptionalFieldsSection: FC<OptionalFieldsSection.Props> = ({ draft, onView }) => {
	return (
		<>
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
					action={<ChevronAction />}
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
					action={<ChevronAction />}
					onClick={() => onView("pros")}
					wrapperProps={{
						ui: {
							tone: (draft.pros ?? []).length > 0 ? "neutral" : "secondary",
						},
					}}
				/>

				<ConsValueList
					cons={draft.cons ?? []}
					action={<ChevronAction />}
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
					action={<ChevronAction />}
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
					action={<ChevronAction />}
					onClick={() => onView("warranty")}
					wrapperProps={{
						ui: {
							tone: draft.warranty ? "neutral" : "secondary",
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
							tone: draft.restriction ? "neutral" : "secondary",
						},
					}}
				/>
			</Group>
		</>
	);
};
