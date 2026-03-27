import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { DraftIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { EmptyStatus } from "~/@common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={DraftIcon}
			textTitle={translator.text("No drafts (title)")}
			textMessage={translator.text("No drafts (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/draft/resolve"}
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
			{...props}
		/>
	);
};
