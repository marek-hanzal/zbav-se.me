import { useLocale } from "@use-pico/client/hook";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace RangeValue {
	export interface Props extends LabelValue.PropsEx {
		feed: tFeed;
	}
}

export const RangeValue: FC<RangeValue.Props> = ({ feed, ...props }) => {
	const locale = useLocale();

	return (
		<LabelValue
			data-ui={"RangeValue[LabelValue]"}
			textLabel={translator.text("Feed range (label)")}
			textValue={
				feed.query?.filter?.range
					? `${toLocaleNumber({
							locale,
							number: feed.query?.filter?.range,
							maximumFractionDigits: 1,
						})} km`
					: null
			}
			textEmpty={translator.text("Feed range not set")}
			textHint={translator.text("Feed range (hint)")}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			ui={{
				disabled: !feed.query?.meta?.latLon,
			}}
			wrapperProps={{
				ui: feed.query?.filter?.range
					? {
							tone: "neutral",
							theme: "light",
						}
					: undefined,
			}}
			{...props}
		/>
	);
};
