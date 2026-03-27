import { ChevronRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
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
					{...uiCtaLinkButton({
						className: [],
					})}
				>
					<Tx label={"Go to listings (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
