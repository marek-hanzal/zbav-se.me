import { ChevronRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import { type FC, useState } from "react";
import { EmptyStatus } from "~/app/@common/status/ui/EmptyStatus";
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
						iconEnabled={ChevronRightIcon}
						iconPosition={"right"}
						onClick={() => setIsOpen(true)}
						{...uiCtaLinkButton({
							className: [],
						})}
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
