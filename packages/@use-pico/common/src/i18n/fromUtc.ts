import { DateTime } from "luxon";

export namespace fromUtc {
	export interface Props {
		input: string;
	}
}

export const fromUtc = ({ input }: fromUtc.Props) => {
	return DateTime.fromISO(input, {
		zone: "utc",
	});
};
