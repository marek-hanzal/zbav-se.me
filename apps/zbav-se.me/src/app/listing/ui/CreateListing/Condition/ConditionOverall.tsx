import { Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { Condition } from "./Condition";

export const ConditionOverall: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const condition = useCreateListingStore((state) => state.condition);
	const setCondition = useCreateListingStore((state) => state.setCondition);

	return (
		<Condition
			icon={ConditionIcon}
			textTitle={<Tx label={"Condition - Overall (title)"} />}
			textDescription={<Tx label={"Condition - Overall (description)"} />}
			textHint={
				<Tx label={`Condition - Overall [${condition}] (hint)`} />
			}
			value={condition}
			onChange={setCondition}
			limit={5}
		/>
	);
};
