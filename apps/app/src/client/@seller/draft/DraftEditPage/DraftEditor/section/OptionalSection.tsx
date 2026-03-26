import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { DeliveryValueList } from "~/client/@common/delivery/ui/DeliveryValueList";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import { ChevronAction } from "../ChevronAction";
import type { DraftEditor } from "../DraftEditor";
import { AgeValue } from "../value/AgeValue";
import { ConditionValue } from "../value/ConditionValue";
import { ConsValueList } from "../value/ConsValueList";
import { DescriptionValue } from "../value/DescriptionValue";
import { ProsValueList } from "../value/ProsValueList";
import { WarrantyValue } from "../value/WarrantyValue";

export namespace OptionalSection {
	export interface Props {
		draft: DraftSchema.Type;
		onView(view: DraftEditor.View): void;
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
