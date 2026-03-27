import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace EmptyListings {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const EmptyListings: FC<EmptyListings.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={MessageIcon}
			textTitle={translator.text("No transactions, no listings (title)")}
			textMessage={translator.text("No transactions, no listings (message)")}
			action={
				<LinkTo
					data-action={"go to drafts"}
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
					<Tx label={"Go to my drafts (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
