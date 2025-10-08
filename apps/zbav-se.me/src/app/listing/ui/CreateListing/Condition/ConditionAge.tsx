import { Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "./Condition";

export const ConditionAge: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const age = useCreateListingStore((state) => state.age);
	const setAge = useCreateListingStore((state) => state.setAge);

	return (
		<Condition
			icon={"icon-[hugeicons--package-process]"}
			textTitle={<Tx label={"Condition - Age (title)"} />}
			textDescription={<Tx label={"Condition - Age (description)"} />}
			textHint={<Tx label={`Condition - Age [${age}] (hint)`} />}
			value={age}
			onChange={setAge}
			limit={5}
		/>
	);
};
