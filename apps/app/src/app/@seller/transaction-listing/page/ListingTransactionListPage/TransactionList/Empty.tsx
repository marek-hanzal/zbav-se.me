import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
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
					ui={{
						background: "default",
						border: true,
						shadow: true,
						round: "default",
						size: "default",
					}}
				>
					<Tx label="Go to my listings (button)" />
				</LinkTo>
			}
			{...props}
		/>
	);
};
