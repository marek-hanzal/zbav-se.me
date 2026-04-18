import type { FC } from "react";
import { ChevronRightIcon, MessageIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={MessageIcon}
			textTitle={translator.text("No transactions as seller (title)")}
			textMessage={translator.text("No transactions as seller (message)")}
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
