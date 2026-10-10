import type { FC } from "react";
import { DraftIcon } from "~/application-ui/constant/icon.exports";
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
			icon={DraftIcon}
			textTitle={translator.text("No drafts (title)")}
			textMessage={translator.text("No drafts (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/draft/resolve"}
					params={{
						locale,
					}}
					{...uiCtaLinkButton({})}
				>
					<Tx label={"Create new draft (link)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
