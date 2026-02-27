import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { LocationValue } from "~/app/@common/location/ui/LocationValue";
import { RangeValue } from "~/app/@common/location/ui/RangeValue";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";

export namespace LocationSection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const LocationSection: FC<LocationSection.Props> = ({ feed, values }) => {
	return (
		<Group>
			<LocationValue
				locationId={feed.locationId}
				textLabel={translator.text("Feed location (label)")}
				textEmpty={translator.text("Feed location not selected")}
				textHint={translator.text("Feed location (hint)")}
				action={
					<Icon
						icon={ChevronRightIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				wrapperProps={{
					ui: {
						tone: feed.locationId ? "neutral" : "secondary",
					},
				}}
				{...values?.location}
			/>

			<RangeValue
				range={feed.query?.filter?.range}
				ui={{
					disabled: !feed.query?.meta?.latLon,
				}}
				action={
					<Icon
						icon={ChevronRightIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				wrapperProps={{
					ui: {
						tone: feed.query?.filter?.range ? "neutral" : "secondary",
					},
				}}
				{...values?.range}
			/>
		</Group>
	);
};
