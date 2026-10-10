import type { FC } from "react";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { MessageIcon } from "~/ui/constant/MessageIcon";
import type { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={MessageIcon}
			textTitle={translator.text("No transactions as buyer (title)")}
			textMessage={translator.text("No transactions as buyer (message)")}
			action={
				<LinkTo
					data-action={"go to my feed"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to="/$locale/app/buyer/feed/default"
					params={{
						locale,
					}}
					{...uiCtaLinkButton({})}
				>
					<Tx label="Go to my feed (button)" />
				</LinkTo>
			}
			{...props}
		/>
	);
};
