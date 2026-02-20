import { DateTime } from "luxon";

export const withRandomInt = (min: number, max: number) => {
	const low = Math.ceil(Math.min(min, max));
	const high = Math.floor(Math.max(min, max));
	return Math.floor(Math.random() * (high - low + 1)) + low;
};

export const withRandomDateBetween = (from: DateTime, to: DateTime) => {
	const start = Math.min(from.toMillis(), to.toMillis());
	const end = Math.max(from.toMillis(), to.toMillis());
	const stamp = withRandomInt(start, end);
	return DateTime.fromMillis(stamp);
};

export const withRandomPastDate = (yearsBack = 2) => {
	const now = DateTime.now();
	return withRandomDateBetween(
		now.minus({
			years: yearsBack,
		}),
		now,
	);
};

export interface InteractionTimeline {
	createAt: DateTime;
	acceptAt: DateTime;
	buyerMessageAt: DateTime;
	sellerMessageAt: DateTime;
	metadataAt: DateTime;
	resolveAt: DateTime;
	finalAt: DateTime;
}

export const withInteractionTimeline = ({ from }: { from: DateTime }): InteractionTimeline => {
	const now = DateTime.now();
	const baseline =
		from.toMillis() <
		now
			.minus({
				years: 2,
			})
			.toMillis()
			? now.minus({
					years: 2,
				})
			: from;
	const start = withRandomDateBetween(
		baseline,
		now.minus({
			hours: 1,
		}),
	);
	const limit = start.plus({
		hours: withRandomInt(24, 72),
	});
	const ghostHours = Math.random() < 0.35 ? withRandomInt(6, 18) : 0;

	const clamp = (value: DateTime) => (value.toMillis() > limit.toMillis() ? limit : value);

	const createAt = start;
	const acceptAt = clamp(
		createAt.plus({
			minutes: withRandomInt(5, 180),
		}),
	);
	const buyerMessageAt = clamp(
		acceptAt.plus({
			minutes: withRandomInt(1, 45),
		}),
	);
	const sellerMessageAt = clamp(
		buyerMessageAt.plus({
			minutes: withRandomInt(5, 180),
		}),
	);
	const metadataAt = clamp(
		sellerMessageAt.plus({
			hours: ghostHours,
			minutes: withRandomInt(5, 120),
		}),
	);
	const resolveAt = clamp(
		metadataAt.plus({
			hours: withRandomInt(2, 24),
		}),
	);
	const finalAt = clamp(
		resolveAt.plus({
			hours: withRandomInt(1, 24),
		}),
	);

	return {
		createAt,
		acceptAt,
		buyerMessageAt,
		sellerMessageAt,
		metadataAt,
		resolveAt,
		finalAt,
	};
};
