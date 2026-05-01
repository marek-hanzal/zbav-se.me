import type { FC } from "react";
import { ChevronRightIcon, MessageIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
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
					to={"/$locale/app/seller/listing/resolve"}
					params={{
						locale,
					}}
					{...uiCtaLinkButton({})}
				>
					<Tx label={"Go to my drafts (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
