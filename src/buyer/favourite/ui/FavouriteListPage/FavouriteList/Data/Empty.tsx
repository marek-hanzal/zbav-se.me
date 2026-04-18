import type { FC } from "react";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { FavouriteIcon } from "~/common/ui/icon";
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
			data-ui={"Empty"}
			icon={FavouriteIcon}
			textTitle={translator.text("No items in favourites (title)")}
			textMessage={translator.text("No items in favourites (message)")}
			action={
				<LinkTo
					data-action={"go to listings"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/buyer/feed/default"}
					params={{
						locale,
					}}
					{...uiCtaLinkButton({})}
				>
					<Tx label={"Go to listings (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
