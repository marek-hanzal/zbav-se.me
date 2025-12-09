import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import type { FC } from "react";

export const ContactSheet: FC = () => {
	return (
		<Container
			data-ui={"ContactSheet"}
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
			className={[
				"reveal",
			]}
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
				/>
			</Status>
		</Container>
	);
};
