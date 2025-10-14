import { Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export const FeaturesSheet: FC = () => {
	return (
		<Sheet>
			<div
				className={tvc([
					"grid",
					"grid-cols-1 md:grid-cols-3",
					"gap-3",
				])}
			>
				<div className={"reveal"}>
					<Status
						textTitle={<Tx label={"Landing - Feature 1 (title)"} />}
						textMessage={
							<Tx label={"Landing - Feature 1 (text)"} />
						}
					/>
				</div>
				<div className={"reveal"}>
					<Status
						textTitle={<Tx label={"Landing - Feature 2 (title)"} />}
						textMessage={
							<Tx label={"Landing - Feature 2 (text)"} />
						}
					/>
				</div>
				<div className={"reveal"}>
					<Status
						textTitle={<Tx label={"Landing - Feature 3 (title)"} />}
						textMessage={
							<Tx label={"Landing - Feature 3 (text)"} />
						}
					/>
				</div>
			</div>
		</Sheet>
	);
};
