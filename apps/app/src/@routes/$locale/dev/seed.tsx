/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { genId } from "@use-pico/common/gen-id";
import { linkTo } from "@use-pico/common/link-to";
import {
	apiCategoryCollection,
	apiListingCreate,
	apiLocationAutocomplete,
	sListingCreate,
	tCurrencyList,
	tListingExpire,
	type tUpload,
} from "@zbav-se.me/sdk/api/session";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation";
import { Sheet } from "@zbav-se.me/ui/sheet";
import axios from "axios";
import PQueue from "p-queue";

/* ----------------------- UTILITIES ----------------------- */

function range(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)]!;
}
function shuffle<T>(arr: T[]): T[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [
			a[j]!,
			a[i]!,
		];
	}
	return a;
}
function maybe<T>(val: T, p = 0.5): T | undefined {
	return Math.random() < p ? val : undefined;
}

/* ----------------------- TITLE GENERATOR ----------------------- */
/**
 * Strategy:
 *  - Larger base sets (brand+model / item+variant).
 *  - Czech marketplace reality: Alza/účtenka/krabice/sleva/odběr/pošta/baterie %...
 *  - Attributes: color, storage/RAM/SSD, sizes, year, tags, fulfillment.
 *  - Mild noise: random casing, diacritics removal sometimes, tiny typos, swapped order.
 *  - Fit to MAX_TITLE_LEN (64) with smart abbreviation & progressive trimming.
 */

const MAX_TITLE_LEN = sListingCreate.properties.title.maxLength;

// Base sets — intentionally broad for combinatorics while staying meaningful
const TITLE_SETS: string[][] = [
	// Phones / tech
	[
		"apple",
		"iphone 13",
	],
	[
		"apple",
		"iphone 13 mini",
	],
	[
		"apple",
		"iphone 12 pro",
	],
	[
		"apple",
		"iphone se",
	],
	[
		"samsung",
		"galaxy s21",
	],
	[
		"samsung",
		"galaxy a52",
	],
	[
		"xiaomi",
		"redmi note 10",
	],
	[
		"xiaomi",
		"redmi note 12 pro",
	],
	[
		"google",
		"pixel 7",
	],
	[
		"google",
		"pixel 6a",
	],
	[
		"oneplus",
		"9 pro",
	],
	[
		"oneplus",
		"nord 2",
	],
	[
		"nothing",
		"phone (2)",
	],
	[
		"motorola",
		"edge 40",
	],

	// Laptops / tablets
	[
		"apple",
		"macbook pro 14",
	],
	[
		"apple",
		"macbook air m1",
	],
	[
		"apple",
		"ipad pro 11",
	],
	[
		"apple",
		"ipad air 5",
	],
	[
		"lenovo",
		"thinkpad t14",
	],
	[
		"dell",
		"xps 13",
	],
	[
		"hp",
		"omen 16",
	],
	[
		"asus",
		"rog zephyrus g14",
	],
	[
		"microsoft",
		"surface pro 7",
	],

	// Audio / wearables
	[
		"apple",
		"airpods pro 2",
	],
	[
		"sony",
		"wh-1000xm4",
	],
	[
		"sony",
		"wf-1000xm5",
	],
	[
		"apple",
		"watch series 8",
	],
	[
		"garmin",
		"forerunner 255",
	],
	[
		"fitbit",
		"sense 2",
	],

	// Consoles / gaming
	[
		"playstation 5",
		"dualsense",
	],
	[
		"xbox series x",
		"controller",
	],
	[
		"nintendo switch",
		"oled",
	],
	[
		"steam",
		"deck",
	],
	[
		"logitech",
		"g29",
	],

	// Cameras / drones
	[
		"gopro",
		"hero 11",
	],
	[
		"dji",
		"mavic mini 2",
	],
	[
		"dji",
		"mini 3 pro",
	],
	[
		"canon",
		"eos 80d",
	],
	[
		"sony",
		"a6400",
	],

	// Fashion / shoes
	[
		"nike",
		"air max 90",
	],
	[
		"adidas",
		"ultraboost",
	],
	[
		"converse",
		"chuck taylor",
	],
	[
		"levis",
		"501",
	],
	[
		"the north face",
		"hoodie",
	],

	// Home / tools / misc
	[
		"dyson",
		"v11",
	],
	[
		"ikea",
		"kallax",
	],
	[
		"bosch",
		"vrtačka",
	],
	[
		"makita",
		"šroubovák",
	],
	[
		"trek",
		"marlin 7",
	],
	[
		"bugaboo",
		"kočárek",
	],
	[
		"barum",
		"zimní pneu",
	],
	[
		"lego",
		"millennium falcon",
	],
	[
		"fender",
		"stratocaster",
	],

	// Appliances / kitchen
	[
		"philips",
		"airfryer",
	],
	[
		"tefal",
		"pánve set",
	],
	[
		"kitchenaid",
		"robot",
	],
	[
		"eta",
		"mixér",
	],
	[
		"bosch",
		"myčka",
	],

	// Furniture
	[
		"ikea",
		"hemnes komoda",
	],
	[
		"ikea",
		"lack stůl",
	],
	[
		"jysk",
		"matrace",
	],

	// Sports / outdoor
	[
		"specialized",
		"rockhopper",
	],
	[
		"salomon",
		"lyže",
	],
	[
		"decathlon",
		"koloběžka",
	],
	[
		"xiaomi",
		"electric scooter",
	],

	// Baby / kids
	[
		"cybex",
		"autosedačka",
	],
	[
		"angelcare",
		"monitor dechu",
	],
	[
		"stokke",
		"tripp trapp",
	],

	// Auto / moto
	[
		"alu kola",
		'17"',
	],
	[
		"zimní pneu",
		"205/55 r16",
	],

	// Books / media
	[
		"harry potter",
		"komplet",
	],
	[
		"murakami",
		"norské dřevo",
	],
];

const ACTIONS = [
	"prodám",
	"koupím",
	"vyměním",
	"darujem",
	"rezervace",
	"beru objednávky",
];

const CONDITIONS = [
	"nové",
	"jako nové",
	"zánovní",
	"použité",
	"lehce jeté",
	"na díly",
	"rozbaleno",
	"repas",
	"plně funkční",
	"nefunkční",
	"se zárukou",
	"bez záruky",
	"drobná vada",
];

const COLORS = [
	"černá",
	"bílá",
	"stříbrná",
	"šedá",
	"modrá",
	"zelená",
	"červená",
	"fialová",
	"zlatá",
	"grafit",
];

const STORAGE = [
	"32GB",
	"64GB",
	"128GB",
	"256GB",
	"512GB",
	"1TB",
	"2TB",
	"4GB RAM",
	"8GB RAM",
	"16GB RAM",
	"32GB RAM",
	"256GB SSD",
	"512GB SSD",
	"1TB SSD",
];

const YEARS = Array.from(
	{
		length: 11,
	},
	(_, i) => String(2015 + i),
); // 2015–2025

const SIZES = [
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"42",
	"43",
	"44",
	"45",
	'27"',
	'32"',
	'55"',
	'65"',
	"90x200",
];

const OFFER_TAGS = [
	"set",
	"komplet",
	"balení",
	"bundle",
	"dárek",
	"účtenka",
	"doklad",
	"záruka do 2026",
	"sleva možná",
	"cena pevná",
	"dohoda jistá",
];

const FULFILLMENT = [
	"osobní odběr",
	"Zásilkovna",
	"pošta",
	"dovoz možný",
	"preferuji Praha",
	"Praha",
	"Brno",
];

const SEPARATORS = [
	" ",
	" - ",
	" | ",
	", ",
];

const ENDINGS = [
	"",
	"",
	"",
	"",
	".",
	"!",
	" (TOP)",
	" *",
	" – super stav",
	" ✅",
];

// Czech marketplace reality bits
const CZECH_REALITY = [
	"nevhodný dárek",
	"koupeno v Alze",
	"doklad",
	"účtenka",
	"bez krabice",
	"s krabicí",
	"komplet balení",
	"přidám obal",
	"přidám kryt",
	"nalepené sklo",
	"TOP stav",
	"po servisu",
	"baterie 90%",
	"baterie 80%",
	"spolehlivý kus",
	"sleva možná",
	"cena pevná",
	"dohoda jistá",
	"osobní odběr",
	"Zásilkovna",
	"pošta",
	"preferuji Praha",
	"Praha",
	"Brno",
	"posílám hned",
	"rychlé jednání",
	"rezervace",
];

// Abbreviation map used before hard cut
const ABBREV_MAP: Record<string, string> = {
	"osobní odběr": "os. odběr",
	osobní: "os.",
	preferuji: "pref.",
	Zásilkovna: "Zás.",
	"dohoda jistá": "dohoda",
	"komplet balení": "kompl. balení",
	komplet: "kompl.",
	doklad: "dok.",
	účtenka: "účt.",
	záruka: "zár.",
	"bez krabice": "bez krab.",
	"s krabicí": "s krab.",
	"rychlé jednání": "rychl. jednání",
};

function applyAbbrev(s: string): string {
	for (const [k, v] of Object.entries(ABBREV_MAP)) {
		s = s.replace(new RegExp(`\\b${k}\\b`, "gi"), v);
	}
	return s;
}

/** optional random casing for one token (tests case-insensitivity of embedding) */
function tweakCasing(s: string): string {
	const mode = range(0, 4);
	switch (mode) {
		case 0:
			return s.toLowerCase();
		case 1:
			return s.toUpperCase();
		case 2:
			return s.replace(/\b\w/g, (m) => m.toUpperCase());
		default:
			return s;
	}
}

/** remove Czech diacritics (quick map; good enough for seeding) */
function stripDiacritics(s: string): string {
	const map: Record<string, string> = {
		á: "a",
		č: "c",
		ď: "d",
		é: "e",
		ě: "e",
		í: "i",
		ň: "n",
		ó: "o",
		ř: "r",
		š: "s",
		ť: "t",
		ú: "u",
		ů: "u",
		ý: "y",
		ž: "z",
		Á: "A",
		Č: "C",
		Ď: "D",
		É: "E",
		Ě: "E",
		Í: "I",
		Ň: "N",
		Ó: "O",
		Ř: "R",
		Š: "S",
		Ť: "T",
		Ú: "U",
		Ů: "U",
		Ý: "Y",
		Ž: "Z",
	};
	return s.replace(/\p{Diacritic}+/gu, (c) => map[c] ?? c);
}

/** tiny typo: glue numbers/letters or tighten dashes a bit */
function tinyTypo(s: string): string {
	if (Math.random() < 0.2) {
		s = s.replace(/\b(iphone)\s+(\d+)/i, "$1$2"); // iPhone13
	}
	if (Math.random() < 0.15) {
		s = s.replace(/\s{2,}/g, " ");
		s = s.replace(/\s*-\s*/g, "-"); // tighten dashes
	}
	return s;
}

function randomTitle(): string {
	// 1) base keywords
	const baseSet = shuffle(pick(TITLE_SETS)).map((t) => tweakCasing(t));
	let [vendor, model] = baseSet;
	if (Math.random() < 0.12) vendor = "";
	if (Math.random() < 0.08) model = "";

	let base: string[] = (
		Math.random() < 0.25
			? [
					model,
					vendor,
				].filter(Boolean)
			: [
					vendor,
					model,
				].filter(Boolean)
	) as string[];

	// 2) optional prefixes
	const prefixBits = [
		maybe(pick(ACTIONS), 0.4),
		maybe(pick(CONDITIONS), 0.45),
	].filter(Boolean) as string[];

	// 3) attributes (+ Czech reality)
	const attrsPool = [
		maybe(pick(COLORS), 0.35),
		maybe(pick(STORAGE), 0.55),
		maybe(pick(SIZES), 0.3),
		maybe(pick(YEARS), 0.3),
		maybe(pick(OFFER_TAGS), 0.35),
		maybe(pick(FULFILLMENT), 0.25),
		maybe(pick(CZECH_REALITY), 0.55),
	].filter(Boolean) as string[];
	let attrs = shuffle(attrsPool).slice(0, range(1, 3));

	// 4) assemble & small noise
	let sep = pick(SEPARATORS);
	let parts = [
		...prefixBits,
		...base,
		...attrs,
	].filter(Boolean);

	if (parts.length > 0 && Math.random() < 0.3) {
		const idx = range(0, parts.length - 1);
		parts[idx] = tweakCasing(parts[idx]!);
	}
	if (Math.random() < 0.08) parts = parts.reverse();

	let ending = pick(ENDINGS);
	let title = parts.join(sep);
	if (Math.random() < 0.18) title = stripDiacritics(title);
	title = tinyTypo(title);
	title = (title + ending).trim();

	// 5) fit to MAX_TITLE_LEN with progressive trimming
	const rebuild = () => (title = (parts.join(sep) + ending).trim());

	// A) try abbreviations
	if (title.length > MAX_TITLE_LEN) {
		title = applyAbbrev(title);
	}

	// B) drop ending
	if (title.length > MAX_TITLE_LEN && ending) {
		ending = "";
		rebuild();
		title = applyAbbrev(title);
	}

	// C) shrink separator
	if (title.length > MAX_TITLE_LEN && sep !== " ") {
		sep = " ";
		rebuild();
		title = applyAbbrev(title);
	}

	// D) remove soft attributes first (fulfillment / meta chatter)
	const isSoft = (t: string) =>
		/os\.|Zás\.|Zásilkovna|pošta|Praha|Brno|dohoda|dok\.|účt\.|krab/i.test(
			t,
		) || /dárek|rezervace|rychl|TOP/i.test(t);

	if (title.length > MAX_TITLE_LEN && attrs.length > 0) {
		const hard: string[] = [];
		const soft: string[] = [];
		for (const a of attrs) (isSoft(a) ? soft : hard).push(a);
		attrs = [
			...hard,
			...soft,
		]; // soft last → popped first
		parts = [
			...prefixBits,
			...base,
			...attrs,
		];
		rebuild();
	}

	while (title.length > MAX_TITLE_LEN && attrs.length > 0) {
		attrs.pop();
		parts = [
			...prefixBits,
			...base,
			...attrs,
		];
		rebuild();
	}

	// E) trim prefixes (second → first)
	while (title.length > MAX_TITLE_LEN && prefixBits.length > 1) {
		prefixBits.pop();
		parts = [
			...prefixBits,
			...base,
			...attrs,
		];
		rebuild();
	}
	if (title.length > MAX_TITLE_LEN && prefixBits.length > 0) {
		prefixBits.pop();
		parts = [
			...prefixBits,
			...base,
			...attrs,
		];
		rebuild();
	}

	// F) trim base (keep first)
	if (title.length > MAX_TITLE_LEN && base.length > 1) {
		base = [
			base[0]!,
		];
		parts = [
			...prefixBits,
			...base,
			...attrs,
		];
		rebuild();
	}

	// G) final hard cut
	if (title.length > MAX_TITLE_LEN) {
		title = title.slice(0, MAX_TITLE_LEN).trim();
	}

	return title;
}

/* ----------------------- PICSUM ----------------------- */
export async function picsum(): Promise<Blob> {
	const sig = genId();

	const proxy = linkTo({
		base: import.meta.env.VITE_SERVER_API,
		href: "/api/cors-proxy",
	});

	const target = linkTo({
		base: "https://picsum.photos",
		href: `/seed/${sig}/1024/768.jpg`,
	});

	return axios
		.get<Blob>(`${proxy}?url=${encodeURIComponent(target)}`, {
			responseType: "blob",
			maxRedirects: 0,
			timeout: 10_000,
		})
		.then((res) => res.data);
}

/* ----------------------- ROUTE ----------------------- */
export const Route = createFileRoute("/$locale/dev/seed")({
	component() {
		const uploadMutation = withUploadMutation.useMutation();

		const seedMutation = useMutation({
			mutationKey: [
				"seed",
			],
			async mutationFn() {
				const category = await apiCategoryCollection({
					throwOnError: true,
					body: {
						cursor: {
							page: 0,
							size: 512,
						},
					},
				}).then((res) => res.data);

				const locations = [
					"Benátky nad Jizerou",
					"Benešov",
					"Břeclav",
					"Brno",
					"Česká Lípa",
					"České Budějovice",
					"Cheb",
					"Chomutov",
					"Děčín",
					"Děčín",
					"Domažlice",
					"Frýdek-Místek",
					"Havířov",
					"Havlíčkův Brod",
					"Hodonín",
					"Hradec Králové",
					"Humpolec",
					"Jablonec nad Nisou",
					"Jihlava",
					"Karlovy Vary",
					"Kolín",
					"Kroměříž",
					"Liberec",
					"Litoměřice",
					"Litvínov",
					"Mělník",
					"Mladá Boleslav",
					"Nový Jičín",
					"Olomouc",
					"Opava",
					"Ostrava",
					"Pardubice",
					"Písek",
					"Plzeň",
					"Poděbrady",
					"Praha",
					"Prostějov",
					"Rakovník",
					"Střelice",
					"Tábor",
					"Tavíkovice, Dobronice",
					"Tavíkovice",
					"Teplice",
					"Třebíč",
					"Trutnov",
					"Uherské Hradiště",
					"Ústí nad Labem",
					"Vysoké Mýto",
					"Zlín",
					"Znojmo",
				];

				const concurrency = 4;
				const limit = 1000 * 5;
				const photos = 64;

				const uploadQueue = new PQueue({
					concurrency,
				});
				const uploadIds = await Promise.all<tUpload>(
					new Array(photos).fill(0).map(() =>
						uploadQueue.add(async () => {
							const blob = await picsum();
							return uploadMutation.mutateAsync({
								name: "photo.jpg",
								blob,
							});
						}),
					),
				);

				const locationQueue = new PQueue({
					concurrency,
				});
				const locationIds = await Promise.all<string>(
					locations.map((locationName) =>
						locationQueue.add(async () => {
							const result = await apiLocationAutocomplete({
								throwOnError: true,
								body: {
									lang: "cs",
									text: locationName,
								},
							});
							return result.data[0]!.id;
						}),
					),
				);

				const queue = new PQueue({
					concurrency,
				});

				const createListing = async () => {
					const currencies = Object.values(tCurrencyList);
					return apiListingCreate({
						throwOnError: true,
						body: {
							age: range(1, 6),
							condition: range(1, 6),
							categoryId:
								category.data[
									range(0, category.data.length - 1)
								]!.id,
							price: range(0, 99_999),
							currency:
								currencies[range(0, currencies.length - 1)]!,
							title: randomTitle(),
							expiresAt:
								tListingExpire[
									Object.keys(tListingExpire)[
										range(
											0,
											Object.keys(tListingExpire).length -
												1,
										)
									] as keyof typeof tListingExpire
								],
							locationId:
								locationIds[range(0, locationIds.length - 1)]!,
							uploadIds: [
								uploadIds[range(0, uploadIds.length - 1)]!.id,
							],
						},
					}).then((res) => res.data);
				};

				for (let i = 0; i < limit; i++) {
					queue.add(createListing);
				}
				await queue.onIdle();
			},
		});

		return (
			<Sheet>
				<Button
					onClick={() => seedMutation.mutate()}
					disabled={seedMutation.isPending}
					loading={seedMutation.isPending}
					tweak={{
						slot: {
							wrapper: {
								class: [
									"mx-auto",
								],
							},
						},
					}}
					tone={"secondary"}
					theme={"dark"}
					size={"xl"}
				>
					Seed
				</Button>
			</Sheet>
		);
	},
});
