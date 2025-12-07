import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import type { FC } from "react";

export const ContactSheet: FC = () => {
	return (
		<Container
			ui={"ContactSheet-root"}
			layout={"vertical-centered"}
			className={"reveal"}
		>
			<Status
				icon={"icon-[line-md--email-twotone]"}
				textTitle={"Landing - Contact (title)"}
				textMessage={"Landing - Contact (text)"}
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
		</Container>
	);
};
