import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={MessageIcon}
			textTitle={translator.text("No listings with transactions (title)")}
			textMessage={translator.text("No listings with transactions (message)")}
			action={
				<LinkTo
					data-action={"go to my listings"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/listing/my"}
					params={{
						locale,
					}}
					{...uiCtaLinkButton({
						className: [],
					})}
				>
					<Tx label={"Go to my listings (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
