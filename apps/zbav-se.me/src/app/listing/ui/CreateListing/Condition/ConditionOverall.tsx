import { Container, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { Rating } from "~/app/ui/rating/Rating";

export const ConditionOverall: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const condition = useCreateListingStore((state) => state.condition);
	const setCondition = useCreateListingStore((state) => state.setCondition);

	return (
		<Container
			tone={"primary"}
			theme={"light"}
			round={"xl"}
			border={"sm"}
			square={"md"}
		>
			<Status
				icon={ConditionIcon}
				textTitle={<Tx label={"Condition - Overall (title)"} />}
				textMessage={<Tx label={"Condition - Overall (description)"} />}
			>
				<Rating
					value={condition}
					limit={5}
					onChange={setCondition}
				/>
			</Status>

			<div className={"p-4 text-center"}>
				<Tx
					label={`Condition - Overall [${condition}] (hint)`}
					italic
					tone={"secondary"}
					theme={"light"}
				/>
			</div>
		</Container>
	);
};
