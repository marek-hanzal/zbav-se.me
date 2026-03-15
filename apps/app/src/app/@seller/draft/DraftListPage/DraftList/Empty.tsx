import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { DraftIcon } from "@zbav-se.me/ui/icon";
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
				data-ui="DraftList-[Status.empty]"
				icon={DraftIcon}
				textTitle={translator.text("No drafts (title)")}
				textMessage={translator.text("No drafts (message)")}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={"text-center"}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/seller/draft/resolve"}
						params={{
							locale,
						}}
						{...uiCtaLinkButton({
							className: [],
						})}
					>
						<Tx label={"Create new draft (link)"} />
					</LinkTo>
				}
			/>
		</Container>
	);
};
