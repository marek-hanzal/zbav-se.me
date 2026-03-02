import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { AgeValue } from "~/app/@common/age/ui/AgeValue";
import { ConditionValue } from "~/app/@common/condition/ui/ConditionValue";
import { ConsValueList } from "~/app/@common/cons/ui/ConsValueList";
import { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import { DescriptionValue } from "~/app/@common/description/ui/DescriptionValue";
import { ProsValueList } from "~/app/@common/pros/ui/ProsValueList";
import { WarrantyValue } from "~/app/@common/warranty/ui/WarrantyValue";
import { ChevronAction } from "~/app/@seller-user/draft/ui/DraftEditor/ChevronAction";
import type { Data } from "~/app/@seller-user/draft/ui/DraftEditor/Data";

export namespace OptionalSection {
	export interface Props {
		draft: tDraft;
		onView(view: Data.View): void;
	}
}

export const OptionalSection: FC<OptionalSection.Props> = ({ draft, onView }) => {
	return (
		<>
			<Tx
				label="Draft - those others (title)"
				ui={{
					tone: "secondary",
					theme: "light",
					text: "md",
					color: "lead",
					opacity: "8",
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
