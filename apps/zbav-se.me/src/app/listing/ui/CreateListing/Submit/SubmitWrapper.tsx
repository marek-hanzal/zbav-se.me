import { Button, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace SubmitWrapper {
	export interface Props {
		canSubmit: boolean;
	}
}

export const SubmitWrapper: FC<SubmitWrapper.Props> = ({ canSubmit }) => {
	return (
		<div className="grid grid-cols-1 content-center justify-items-center h-full w-2/3 mx-auto">
			{canSubmit ? (
				<Status
					icon={SendPackageIcon}
					textTitle={<Tx label={"Submit listing - status (title)"} />}
					tone={"primary"}
				>
					<Button
						iconEnabled={CheckIcon}
						tone={"primary"}
						size={"xl"}
					>
						<Tx label={"Submit listing (button)"} />
					</Button>
				</Status>
			) : (
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
			)}
		</div>
	);
};
