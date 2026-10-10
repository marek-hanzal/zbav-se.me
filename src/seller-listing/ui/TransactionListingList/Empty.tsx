import type { FC } from "react";
import { uiCtaLinkButtonFn } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { MessageIcon } from "~/ui/constant/MessageIcon";
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
			icon={MessageIcon}
			textTitle={translator.textFn("No listings with transactions (title)")}
			textMessage={translator.textFn("No listings with transactions (message)")}
			action={
				<LinkTo
					data-action={"go to my listings"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/listing/my"}
					params={{
						locale,
					}}
					{...uiCtaLinkButtonFn({})}
				>
					<Tx label={"Go to my listings (button)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
