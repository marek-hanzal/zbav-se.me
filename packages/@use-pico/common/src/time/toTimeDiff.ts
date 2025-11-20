import { DateTime, type DurationUnits, type ToRelativeOptions } from "luxon";
import { match } from "ts-pattern";

export namespace toTimeDiff {
	export interface Props {
		locale: string;
		time: string;
		/**
		 * ISO date time
		 */
		source?: string;
		type?: "relative" | "human";
		opts?: ToRelativeOptions;
	}
}

export const toTimeDiff = ({
	locale,
	time,
	source,
	type = "relative",
	opts,
}: toTimeDiff.Props): string => {
	const now = (source ? DateTime.fromISO(source) : DateTime.now()).setLocale(locale);
	const target = DateTime.fromISO(time).setLocale(locale);

	if (!target.isValid) {
		console.warn("Invalid target", time);
		return "- invalid time -";
	}

	return match(type)
		.with("human", () => {
			const units: DurationUnits = [
				"year",
				"month",
				"day",
				"hour",
				"minute",
			];

			const diff = target.diff(now, units);

			if (Math.abs(diff.years) > 0) {
				units.pop();
				units.pop();
				units.pop();
			} else if (Math.abs(diff.months) > 0) {
				units.pop();
				units.pop();
			} else if (Math.abs(diff.days) > 0) {
				units.pop();
				units.pop();
			} else if (Math.abs(diff.hours) > 0) {
				units.pop();
			}

			return target.diff(now, units).toHuman({
				listStyle: "long",
				unitDisplay: "long",
				showZeros: false,
				signDisplay: "never",
				maximumFractionDigits: 0,
			});
		})
		.with("relative", () => {
			return (
				target.toRelative({
					locale,
					base: now,
					style: "long",
					...opts,
				}) ?? "- invalid time -"
			);
		})
		.exhaustive();
};
