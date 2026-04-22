import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import { DeliveryValueList } from "~/common/delivery/ui/DeliveryValueList";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ChevronAction } from "../ChevronAction";
import type { DraftEditor } from "../DraftEditor";
import { AgeValue } from "../value/AgeValue";
import { ConditionValue } from "../value/ConditionValue";
import { ConsValueList } from "../value/ConsValueList";
import { DescriptionValue } from "../value/DescriptionValue";
import { ProsValueList } from "../value/ProsValueList";
import { RestrictionValue } from "../value/RestrictionValue";
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
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Group>
				<RestrictionValue
					data-ui={"set listing restriction"}
					restriction={draft.restriction}
					action={<ChevronAction />}
					onClick={() => onView("restriction")}
					wrapperProps={{
						"data-ui-tone": draft.restriction ? "neutral" : "secondary",
					}}
					data-ui-disabled={!draft.category}
				/>
			</Group>

			<Group>
				<DescriptionValue
					description={draft.description}
					action={<ChevronAction />}
					onClick={() => onView("description")}
					wrapperProps={{
						"data-ui-tone": draft.description ? "neutral" : "secondary",
					}}
				/>
			</Group>

			<Group>
				<ProsValueList
					pros={draft.pros ?? []}
					action={<ChevronAction />}
					onClick={() => onView("pros")}
					wrapperProps={{
						"data-ui-tone": (draft.pros ?? []).length > 0 ? "neutral" : "secondary",
					}}
				/>

				<ConsValueList
					cons={draft.cons ?? []}
					action={<ChevronAction />}
					onClick={() => onView("cons")}
					wrapperProps={{
						"data-ui-tone": (draft.cons ?? []).length > 0 ? "neutral" : "secondary",
					}}
				/>
			</Group>

			<Group>
				<DeliveryValueList
					deliveryIn={draft.delivery ?? []}
					action={<ChevronAction />}
					onClick={() => onView("delivery")}
					wrapperProps={{
						"data-ui-tone": (draft.delivery ?? []).length > 0 ? "neutral" : "secondary",
					}}
				/>
			</Group>

			<Group>
				<WarrantyValue
					warranty={draft.warranty}
					action={<ChevronAction />}
					onClick={() => onView("warranty")}
					wrapperProps={{
						"data-ui-tone": draft.warranty ? "neutral" : "secondary",
					}}
				/>
			</Group>

			<Group>
				<ConditionValue
					condition={draft.condition}
					action={<ChevronAction />}
					onClick={() => onView("condition")}
					wrapperProps={{
						"data-ui-tone": draft.condition !== null ? "neutral" : "secondary",
					}}
				/>

				<AgeValue
					age={draft.age}
					action={<ChevronAction />}
					onClick={() => onView("age")}
					wrapperProps={{
						"data-ui-tone": draft.age !== null ? "neutral" : "secondary",
					}}
				/>
			</Group>
		</>
	);
};
