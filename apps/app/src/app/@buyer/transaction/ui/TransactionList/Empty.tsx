import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ ui, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={MessageIcon}
				textTitle={translator.text("No transactions as buyer (title)")}
				textMessage={translator.text("No transactions as buyer (message)")}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to="/$locale/buyer/feed/default"
						params={{
							locale,
						}}
						{...uiCtaLinkButton({
							className: [],
						})}
					>
						<Tx label="Go to my feed (button)" />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
