import { Button, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export const SubmitWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);

	// const categoryQuery = withCategoryListQuery().useQuery(
	// 	{
	// 		filter: {
	// 			idIn: categorySelection.optional.multiId(),
	// 		},
	// 	},
	// 	{
	// 		enabled: canSubmit,
	// 	},
	// );

	if (missing.length > 0) {
		return (
			<Sheet
				tone={"warning"}
				disabled
			>
				<Status
					icon={SendPackageIcon}
					textTitle={
						<Tx
							label={
								"Submit listing - status - cannot submit (title)"
							}
							tone={"warning"}
							theme={"light"}
						/>
					}
					// textMessage={
					// 	<div className="inline-flex flex-row gap-2">
					// 		{missing.map((item) => (
					// 			<Badge
					// 				key={item}
					// 				tone="secondary"
					// 			>
					// 				{item}
					// 			</Badge>
					// 		))}
					// 	</div>
					// }
					tone={"warning"}
				/>
			</Sheet>
		);
	}

	return (
		<Sheet tone={"secondary"}>
			<Status
				icon={SendPackageIcon}
				textTitle={<Tx label={"Submit listing - status (title)"} />}
				tone={"secondary"}
			>
				<Button
					iconEnabled={CheckIcon}
					tone={"secondary"}
					theme={"dark"}
					size={"xl"}
				>
					<Tx label={"Submit listing (button)"} />
				</Button>
			</Status>
		</Sheet>
	);
};
