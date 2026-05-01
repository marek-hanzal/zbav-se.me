import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { ChevronRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { FeedIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { CreateSheet } from "./CreateSheet";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
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
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
