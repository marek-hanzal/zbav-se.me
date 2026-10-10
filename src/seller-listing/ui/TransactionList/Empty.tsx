import type { FC } from "react";
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
			textTitle={translator.textFn("No transactions as seller (title)")}
			textMessage={translator.textFn("No transactions as seller (message)")}
			action={
				<LinkTo
					data-action={"go to my listings"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to="/$locale/app/seller/listing/my"
					params={{
						locale,
					}}
					data-ui-background="default"
					data-ui-border
					data-ui-shadow
					data-ui-round="default"
					data-ui-size="default"
				>
					<Tx label="Go to my listings (button)" />
				</LinkTo>
			}
			{...props}
		/>
	);
};
