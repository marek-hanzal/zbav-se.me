import { Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { Markdown } from "~/app/ui/Markdown";

export namespace AboutSheet {
	export interface Props {
		markdown: string;
	}
}

export const AboutSheet: FC<AboutSheet.Props> = ({ markdown }) => {
	return (
		<Sheet
			tweak={{
				slot: {
					root: {
						class: [
							"p-8",
						],
					},
				},
			}}
		>
			<div className={"reveal"}>
				<Status
					icon={"icon-[mdi--sparkles-outline]"}
					textTitle={<Tx label={"Landing - About (title)"} />}
					textMessage={<Tx label={"Landing - About (text)"} />}
				/>

				<Markdown>{markdown}</Markdown>
			</div>
		</Sheet>
	);
};
