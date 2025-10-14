import { Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export const AboutSheet: FC = () => {
	return (
		<Sheet>
			<div className={"reveal"}>
				<Status
					textTitle={<Tx label={"Landing - About (title)"} />}
					textMessage={<Tx label={"Landing - About (text)"} />}
				/>
			</div>
		</Sheet>
	);
};
