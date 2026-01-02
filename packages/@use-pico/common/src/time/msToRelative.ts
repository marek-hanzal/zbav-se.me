import { DateTime } from "luxon";
import { toTimeDiff } from "./toTimeDiff";

export namespace msToRelative {
	export interface Props {
		locale: string;
		ms: number;
		fallback?: string;
	}
}

export const msToRelative = ({ locale, ms, fallback = "-" }: msToRelative.Props) => {
	if (!ms || ms <= 0) {
		return fallback;
	}

	return toTimeDiff({
		locale,
		time: DateTime.now()
			.minus({
				milliseconds: ms,
			})
			.toISO(),
		type: "relative",
	});
};
