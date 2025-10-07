import { Container, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Rating } from "~/app/ui/rating/Rating";

export const ConditionAge: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const age = useCreateListingStore((state) => state.age);
	const setAge = useCreateListingStore((state) => state.setAge);

	return (
		<Container
			tone={"primary"}
			theme={"light"}
			round={"xl"}
			border={"sm"}
			square={"md"}
		>
			<Status
				icon={"icon-[hugeicons--package-process]"}
				textTitle={<Tx label={"Condition - Age (title)"} />}
				textMessage={<Tx label={"Condition - Age (description)"} />}
			>
				<Rating
					value={age}
					limit={5}
					onChange={setAge}
				/>
			</Status>

			<div className={"p-4 text-center"}>
				<Tx
					label={`Condition - Age [${age}] (hint)`}
					italic
					tone={"secondary"}
					theme={"light"}
				/>
			</div>
		</Container>
	);
};
