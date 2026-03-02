import { SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { type FC, type Ref, useState } from "react";
import { FeedEditor } from "../../FeedEditor/FeedEditor";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		sentinelRef: Ref<HTMLDivElement | null>;
		isLast: boolean;
	}
}

export const Data: FC<Data.Props> = ({ feedId, sentinelRef, isLast }) => {
	const [isEditor, setIsEditor] = useState(false);

	return (
		<>
			<Button
				data-ui={"FeedSetupButton[SheetButton]"}
				iconEnabled={SettingsIcon}
				onClick={() => setIsEditor((prev) => !prev)}
				ui={{
					tone: "secondary",
					theme: "light",
					background: "default",
					justify: "center",
					items: "center",
					square: "default",
					zIndex: true,
					round: "full",
					snapTo: "top-right",
					text: "xl",
					opacity: isLast ? "none" : "8",
				}}
				className={"transition-all"}
			/>

			<FeedEditor feedId={feedId} />
		</>
	);
};
