import { RefreshIcon, SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Group } from "@use-pico/client/ui/group";
import { Tx } from "@use-pico/client/ui/tx";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { type FC, type Ref, useState } from "react";
import { FeedEditorSheet } from "../../FeedEditor/FeedEditorSheet";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		sentinelRef: Ref<HTMLDivElement | null>;
		isLast: boolean;
	}
}

export const Data: FC<Data.Props> = ({ feedId, sentinelRef, isLast }) => {
	const [isEditor, setIsEditor] = useState(false);
	const invalidator = withListingQuery.useInvalidator();

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

			<div>listing list or sthing</div>

			<FeedEditorSheet
				feedId={feedId}
				state={{
					value: isEditor,
					set: setIsEditor,
				}}
			>
				<Group>
					<Button
						iconEnabled={RefreshIcon}
						ui={{
							tone: "neutral",
							theme: "light",
							size: "default",
							justify: "start",
							items: "center",
							background: "default",
							round: undefined,
							shadow: false,
							border: false,
							width: "full",
						}}
						onClick={() => {
							invalidator(
								[
									"collection",
								],
								{},
							);
							setIsEditor(false);
						}}
					>
						<Tx label={"Refresh feed (label)"} />
					</Button>
				</Group>
			</FeedEditorSheet>
		</>
	);
};
