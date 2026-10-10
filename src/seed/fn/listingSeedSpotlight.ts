import type { ListingSpotlightTableSchema } from "~/database/schema/ListingSpotlightTableSchema";

type SpotlightParts = {
	listingId: string;
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

export const buildListingSeedSpotlightRowsFn = ({
	listingId,
	title,
	description,
	pros,
	cons,
}: SpotlightParts): ListingSpotlightTableSchema.Type[] => {
	const phrases = new Map<string, number>();

	addPhraseFn(phrases, title, 1000);
	addTokenPhrasesFn(phrases, title, {
		1: 900,
		2: 850,
		3: 800,
	});
	addTokenPhrasesFn(phrases, description, {
		2: 500,
		3: 450,
	});

	for (const value of [
		...pros,
		...cons,
	]) {
		addPhraseFn(phrases, value, 300);
		addTokenPhrasesFn(phrases, value, {
			1: 250,
			2: 225,
		});
	}

	return toRowsFn(listingId, phrases);
};
