import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace Empty {
	export type Props = {};
}

export const Empty: FC<Empty.Props> = () => {
	const locale = useLocale();

	return (
		<Status
			data-ui={"ListingListContainer-[Status.empty]"}
			icon={"icon-[streamline--sad-face-remix]"}
			textTitle={translator.text("No listings (title)")}
			action={
				<LinkTo
					icon={ChevronLeftIcon}
					to={"/$locale/home"}
					params={{
						locale,
					}}
					ui={{
						tone: "secondary",
						theme: "light",
					}}
				>
					<Tx label="Back to home (link)" />
				</LinkTo>
			}
		/>
	);
};
