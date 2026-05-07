import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { ChevronRightIcon, MessageIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={MessageIcon}
			textTitle={translator.text("No transactions as buyer (title)")}
			textMessage={translator.text("No transactions as buyer (message)")}
			action={
				<LinkTo
					data-action={"go to my feed"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to="/$locale/app/buyer/feed/default"
					params={{
						locale,
					}}
					{...uiCtaLinkButton({})}
				>
					<Tx label="Go to my feed (button)" />
				</LinkTo>
			}
			{...props}
		/>
	);
};
