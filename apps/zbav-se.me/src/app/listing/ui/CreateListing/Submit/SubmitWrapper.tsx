import { Button, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace SubmitWrapper {
	export type Props = {};
}

export const SubmitWrapper: FC<SubmitWrapper.Props> = () => {
	return (
		<div className="grid grid-cols-1 content-center justify-items-center h-full">
			<Status
				icon={SendPackageIcon}
				textTitle={<Tx label={"Submit listing - status (title)"} />}
				tone={"primary"}
			>
				<Button
					iconEnabled={"icon-[ph--check-fat-thin]"}
					tone={"primary"}
					size={"xl"}
				>
					<Tx label={"Submit listing (button)"} />
				</Button>
			</Status>
		</div>
	);
};
