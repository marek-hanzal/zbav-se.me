import type { FC } from "react";
import { FavouriteIcon } from "~/application-ui/constant/icon.exports";
import { uiCtaLinkButton } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<EmptyStatus
			data-ui={"Empty[EmptyStatus]"}
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
