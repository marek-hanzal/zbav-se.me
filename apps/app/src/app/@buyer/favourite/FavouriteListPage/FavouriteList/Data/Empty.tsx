import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { FavouriteIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { EmptyStatus } from "~/app/@common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={FavouriteIcon}
			textTitle={translator.text("No items in favourites (title)")}
			textMessage={translator.text("No items in favourites (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/buyer/feed/default"}
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
