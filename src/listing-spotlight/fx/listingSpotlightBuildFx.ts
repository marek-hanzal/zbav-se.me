import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { ListingSpotlightTableSchema } from "~/database/schema/ListingSpotlightTableSchema";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

type SpotlightParts = {
	title: string;
	description: string | null;
	pros: string[];
	cons: string[];
};

const WORD_PATTERN = /\p{L}[\p{L}\p{N}]*/gu;

const normalizeTextFn = (value: string) =>
	value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();

const tokenizeFn = (value: string) => {
	const normalized = normalizeTextFn(value);
	return Array.from(normalized.matchAll(WORD_PATTERN), (match) => match[0]).filter(
		(token) => token.length >= 2,
	);
};

const addPhraseFn = (map: Map<string, number>, text: string, ranking: number) => {
	const normalized = normalizeTextFn(text).replace(/\s+/g, " ").trim();

	if (normalized.length < 2) {
		return;
	}

	const current = map.get(normalized) ?? Number.NEGATIVE_INFINITY;
	map.set(normalized, Math.max(current, ranking));
};

const addTokenPhrasesFn = (
	map: Map<string, number>,
	value: string | null | undefined,
	rankingBySize: Record<number, number>,
) => {
	if (!value) {
		return;
	}

	const tokens = tokenizeFn(value);

	for (const [sizeText, ranking] of Object.entries(rankingBySize)) {
		const size = Number(sizeText);

		if (tokens.length < size) {
			continue;
		}

		for (let start = 0; start <= tokens.length - size; start += 1) {
			const phrase = tokens.slice(start, start + size).join(" ");
			addPhraseFn(map, phrase, ranking);
		}
	}
};

const toRowsFn = (
	listingId: string,
	map: Map<string, number>,
): ListingSpotlightTableSchema.Type[] => {
	return Array.from(map.entries(), ([text, ranking]) => ({
		listingId,
		text,
		ranking,
	}));
};

export namespace listingSpotlightBuildFx {
	export interface Props {
		listingId: string;
	}
}

export const listingSpotlightBuildFx = Effect.fn("listingSpotlightBuildFx")(function* ({
	listingId,
}: listingSpotlightBuildFx.Props) {
	const logger = yield* getLoggerFx("listingSpotlightBuildFx");
	logger.trace("listingSpotlightBuildFx", {
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const listing = yield* dbFx<SpotlightParts>(async (kysely) => {
				const item = await kysely
					.selectFrom("listing")
					.select([
						"title",
						"description",
						"pros",
						"cons",
					])
					.where("id", "=", listingId)
					.executeTakeFirstOrThrow();

				return {
					...item,
					description: item.description ?? null,
				};
			});

			const phrases = new Map<string, number>();

			addPhraseFn(phrases, listing.title, 1000);
			addTokenPhrasesFn(phrases, listing.title, {
				1: 900,
				2: 850,
				3: 800,
			});
			addTokenPhrasesFn(phrases, listing.description, {
				2: 500,
				3: 450,
			});

			for (const value of [
				...listing.pros,
				...listing.cons,
			]) {
				addPhraseFn(phrases, value, 300);
				addTokenPhrasesFn(phrases, value, {
					1: 250,
					2: 225,
				});
			}

			const rows = toRowsFn(listingId, phrases);

			yield* dbFx(async (kysely) => {
				await kysely
					.deleteFrom("listing_spotlight")
					.where("listingId", "=", listingId)
					.execute();

				if (rows.length === 0) {
					return;
				}

				await kysely
					.insertInto("listing_spotlight")
					.values(rows)
					.onConflict((oc) => {
						return oc
							.columns([
								"listingId",
								"text",
								"ranking",
							])
							.doNothing();
					})
					.execute();
			});
		}),
	);
});
