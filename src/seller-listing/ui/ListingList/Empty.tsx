import type { FC } from "react";
import { SearchIcon } from "~/application-ui/constant/icon.exports";
import { uiCtaLinkButtonFn } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { LinkTo } from "~/ui/ui/LinkTo";

export const Empty: FC = () => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={SearchIcon}
			textTitle={translator.textFn("No my listings (title)")}
			textMessage={translator.textFn("No my listings (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/draft/resolve"}
					params={{
						locale,
					}}
					{...uiCtaLinkButtonFn({})}
				>
					<Tx label={"Create listing (label)"} />
				</LinkTo>
			}
		/>
	);
};
