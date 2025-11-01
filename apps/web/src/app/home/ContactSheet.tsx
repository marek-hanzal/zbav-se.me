import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import { Sheet } from "@zbav-se.me/ui";
import type { FC } from "react";

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
				textTitle={"Landing - Contact (title)"}
				textMessage={"Landing - Contact (text)"}
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
									"w-fit",
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
