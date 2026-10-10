import { type FC, useState } from "react";
import { FeedIcon } from "~/application-ui/constant/icon.exports";
import { uiCtaLinkButton } from "~/application-ui/fn/ui.exports";
import { CreateSheet } from "~/buyer-feed/ui/FeedList/CreateSheet";
import { EmptyStatus } from "~/status/ui/EmptyStatus";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Button } from "~/ui/ui/Button";

export namespace Empty {
	export interface Props extends MarkSuspense.Props, EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ _suspense, ...props }) => {
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<EmptyStatus
				icon={FeedIcon}
				textTitle={translator.text("Feed list empty (title)")}
				textMessage={translator.text("Feed list empty (message)")}
				action={
					<Button
						data-action={"create new feed"}
						iconEnabled={ChevronRightIcon}
						iconPosition={"right"}
						onClick={() => setIsOpen(true)}
						{...uiCtaLinkButton({})}
					>
						<Tx label={"Create new feed (button)"} />
					</Button>
				}
				{...props}
			/>

			<CreateSheet
				_suspense={_suspense}
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
