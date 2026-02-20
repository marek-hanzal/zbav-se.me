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
			days: 3,
		}),
	);
	const ghostHours = Math.random() < 0.35 ? withRandomInt(6, 18) : 0;
	const totalMinutes = withRandomInt(24 * 60, 72 * 60);
	const baseGaps = [
		withRandomInt(5, 180),
		withRandomInt(1, 45),
		withRandomInt(5, 180),
		ghostHours * 60 + withRandomInt(5, 120),
		withRandomInt(2 * 60, 24 * 60),
		withRandomInt(1 * 60, 24 * 60),
	];
	const baseTotal = baseGaps.reduce((sum, value) => sum + value, 0);
	const ratio = baseTotal > 0 ? Math.min(1, totalMinutes / baseTotal) : 1;
	const scaledGaps = baseGaps.map((value) => Math.max(1, Math.floor(value * ratio)));
	const scaledTotal = scaledGaps.reduce((sum, value) => sum + value, 0);
	const lastGap = scaledGaps.at(-1) ?? 1;
	scaledGaps[scaledGaps.length - 1] = lastGap + Math.max(0, totalMinutes - scaledTotal);

	const [acceptGap, buyerGap, sellerGap, metadataGap, resolveGap, finalGap] = scaledGaps;
	const createAt = start;
	const acceptAt = createAt.plus({
		minutes: acceptGap,
	});
	const buyerMessageAt = acceptAt.plus({
		minutes: buyerGap,
	});
	const sellerMessageAt = buyerMessageAt.plus({
		minutes: sellerGap,
	});
	const metadataAt = sellerMessageAt.plus({
		minutes: metadataGap,
	});
	const resolveAt = metadataAt.plus({
		minutes: resolveGap,
	});
	const finalAt = resolveAt.plus({
		minutes: finalGap,
	});

	const boundedFinalAt =
		finalAt.toMillis() >= now.toMillis()
			? now.minus({
					minutes: 1,
				})
			: finalAt;
	const boundedResolveAt =
		resolveAt.toMillis() >= boundedFinalAt.toMillis()
			? boundedFinalAt.minus({
					minutes: 1,
				})
			: resolveAt;

	return {
		createAt,
		acceptAt,
		buyerMessageAt,
		sellerMessageAt,
		metadataAt,
		resolveAt:
			boundedResolveAt.toMillis() <= metadataAt.toMillis()
				? metadataAt.plus({
						minutes: 1,
					})
				: boundedResolveAt,
		finalAt: boundedFinalAt,
	};
};
