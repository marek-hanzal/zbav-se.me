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
	tCurrencyList,
	tListingExpire,
	type tUpload,
} from "@zbav-se.me/sdk/api/session";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation";
import { Sheet } from "@zbav-se.me/ui/sheet";
import axios from "axios";
import PQueue from "p-queue";

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

/**
 * TITLE GENERATOR
 * --------------------------------------------------
 * We prepare 20+ "sets" of keywords. For each title:
 *  - choose a set, shuffle order (tests order sensitivity),
 *  - optionally prepend an action or condition,
 *  - optionally append attributes (storage, color, year),
 *  - randomly vary separators/casing/punctuation.
 */
const TITLE_SETS: string[][] = [
	// Phones / tech
	[
		"apple",
		"iphone 13",
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
		"google",
		"pixel 7",
	],
	[
		"oneplus",
		"9 pro",
	],

	// Laptops / tablets
	[
		"macbook",
		"pro 14",
	],
	[
		"macbook",
		"air m1",
	],
	[
		"ipad",
		"pro 11",
	],
	[
		"ipad",
		"air 5",
	],
	[
		"lenovo",
		"thinkpad t14",
	],
	[
		"dell",
		"xps 13",
	],

	// Audio / wearables
	[
		"airpods",
		"pro 2",
	],
	[
		"sony",
		"wh-1000xm4",
	],
	[
		"apple",
		"watch series 8",
	],
	[
		"garmin",
		"forerunner 255",
	],

	// Consoles / gaming
	[
		"playstation 5",
		"dualSense",
	],
	[
		"xbox series x",
		"controller",
	],
	[
		"nintendo switch",
		"oled",
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
		"canon",
		"eos 80d",
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
		"levis",
		"501",
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
	], // bike
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
];

const ACTIONS = [
	"prodám",
	"koupím",
	"vyměním",
	"darujem",
	"rezervace",
];
const CONDITIONS = [
	"nové",
	"jako nové",
	"zánovní",
	"použité",
	"lehce jeté",
	"na díly",
];
const COLORS = [
	"černá",
	"bílá",
	"stříbrná",
	"modrá",
	"zelená",
	"červená",
	"fialová",
];
const STORAGE = [
	"32GB",
	"64GB",
	"128GB",
	"256GB",
	"512GB",
	"1TB",
];
const YEARS = [
	"2019",
	"2020",
	"2021",
	"2022",
	"2023",
	"2024",
	"2025",
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
];

/** optional random casing for one token (tests case-insensitivity of embedding) */
function tweakCasing(s: string): string {
	const mode = range(0, 4);
	switch (mode) {
		case 0:
			return s.toLowerCase();
		case 1:
			return s.toUpperCase();
		case 2:
			// Capitalize each word
			return s.replace(/\b\w/g, (m) => m.toUpperCase());
		default:
			return s;
	}
}

function randomTitle(): string {
	// 1) base keywords from a random set
	const base = shuffle(pick(TITLE_SETS)).map((t) => tweakCasing(t));

	// 2) optional prefix (action/condition)
	const prefixBits = [
		maybe(pick(ACTIONS), 0.35),
		maybe(pick(CONDITIONS), 0.35),
	].filter(Boolean) as string[];

	// 3) optional attributes (color/storage/year), randomly 0-2 of them
	const attrsPool = [
		maybe(pick(COLORS), 0.4),
		maybe(pick(STORAGE), 0.5),
		maybe(pick(YEARS), 0.35),
	].filter(Boolean) as string[];
	const attrs = shuffle(attrsPool).slice(0, range(0, 2));

	// 4) assemble segments & choose a separator
	const sep = pick(SEPARATORS);
	const parts = [
		...prefixBits,
		...base,
		...attrs,
	].filter(Boolean);
	let title = parts.join(sep);

	// 5) tiny chance to reverse the whole string order, tests extreme order sensitivity
	if (Math.random() < 0.12) {
		title = parts.reverse().join(sep);
	}

	// 6) ending punctuation/noise
	title += pick(ENDINGS);

	return title.trim();
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
							title: randomTitle(), // 👈 here
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
