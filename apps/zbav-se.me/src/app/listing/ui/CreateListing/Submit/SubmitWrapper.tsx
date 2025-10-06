import { Button, Sheet, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace SubmitWrapper {
	export interface Props {
		canSubmit: boolean;
	}
}

export const SubmitWrapper: FC<SubmitWrapper.Props> = ({ canSubmit }) => {
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

	if (!canSubmit) {
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
