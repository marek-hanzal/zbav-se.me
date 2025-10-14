import { Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export const WhatSheet: FC = () => {
	return (
		<Sheet>
			<div className={"reveal"}>
				<Status
					textTitle={<Tx label={"Landing - What (title)"} />}
					textMessage={<Tx label={"Landing - What (text)"} />}
				/>
			</div>
		</Sheet>
	);
};
