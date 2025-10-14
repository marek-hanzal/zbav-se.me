import { Status, Tx, Typo } from "@use-pico/client";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export const ContactSheet: FC = () => {
	return (
		<Sheet
			tweak={{
				slot: {
					root: {
						token: [
							"square.lg",
						],
					},
				},
			}}
		>
			<Status
				icon={"icon-[line-md--email-twotone]"}
				textTitle={<Tx label={"Landing - Contact (title)"} />}
				textMessage={<Tx label={"Landing - Contact (text)"} />}
				tweak={{
					slot: {
						root: {
							class: [
								"reveal",
							],
						},
					},
				}}
			>
				<Typo
					label={"info@zbav-se.me"}
					font={"bold"}
					size={"xl"}
					display={"block"}
					tweak={{
						slot: {
							root: {
								class: [
									"mx-auto",
								],
							},
						},
					}}
				/>
			</Status>
		</Sheet>
	);
};
