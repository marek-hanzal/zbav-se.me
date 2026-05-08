import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingSpotlightTableSchema } from "~/server/database/@table/ListingSpotlightTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

type SpotlightParts = {
	title: string;
	description: string | null;
	pros: string[];
	cons: string[];
};

const WORD_PATTERN = /\p{L}[\p{L}\p{N}]*/gu;

const normalizeText = (value: string) =>
	value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();

const tokenize = (value: string) => {
	const normalized = normalizeText(value);
	return Array.from(normalized.matchAll(WORD_PATTERN), (match) => match[0]).filter(
		(token) => token.length >= 2,
	);
};

const addPhrase = (map: Map<string, number>, text: string, ranking: number) => {
	const normalized = normalizeText(text).replace(/\s+/g, " ").trim();

	if (normalized.length < 2) {
		return;
	}

	const current = map.get(normalized) ?? Number.NEGATIVE_INFINITY;
	map.set(normalized, Math.max(current, ranking));
};

const addTokenPhrases = (
	map: Map<string, number>,
	value: string | null | undefined,
	rankingBySize: Record<number, number>,
) => {
	if (!value) {
		return;
	}

	const tokens = tokenize(value);

	for (const [sizeText, ranking] of Object.entries(rankingBySize)) {
		const size = Number(sizeText);

		if (tokens.length < size) {
			continue;
		}

		for (let start = 0; start <= tokens.length - size; start += 1) {
			const phrase = tokens.slice(start, start + size).join(" ");
			addPhrase(map, phrase, ranking);
		}
	}
};

const toRows = (
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
			const { kysely } = yield* KyselyContextFx;

			const listing = yield* tryDbFx<SpotlightParts>(async () => {
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

			addPhrase(phrases, listing.title, 1000);
			addTokenPhrases(phrases, listing.title, {
				1: 900,
				2: 850,
				3: 800,
			});
			addTokenPhrases(phrases, listing.description, {
				2: 500,
				3: 450,
			});

			for (const value of [
				...listing.pros,
				...listing.cons,
			]) {
				addPhrase(phrases, value, 300);
				addTokenPhrases(phrases, value, {
					1: 250,
					2: 225,
				});
			}

			const rows = toRows(listingId, phrases);

			yield* tryDbFx(async () => {
				await kysely
					.deleteFrom("listing_spotlight")
					.where("listingId", "=", listingId)
					.execute();

				if (rows.length === 0) {
					return;
				}

				await kysely.insertInto("listing_spotlight").values(rows).execute();
			});
		}),
	);
});
