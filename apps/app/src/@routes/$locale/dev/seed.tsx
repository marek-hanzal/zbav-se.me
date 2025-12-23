/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { genId } from "@use-pico/common/gen-id";
import { linkTo } from "@use-pico/common/link-to";
import { list, object, rangedom } from "@use-pico/common/rangedom";
import {
	apiCategoryCollection,
	apiLocationAutocomplete,
	type tCategory,
} from "@zbav-se.me/sdk/api/session";
import {
	apiFavouriteToggle,
	apiFlagToggle,
	apiIgnoreToggle,
	apiListingCollection,
	apiListingCount,
	apiListingCreate,
	tListingDeliveryEnum,
	tListingExpireEnum,
	tListingPriceEnum,
	type tListingSort,
	tListingWarrantyEnum,
} from "@zbav-se.me/sdk/api/user";
import {
	withFeedCreateMutation,
	withListingEventCreateMutation,
	withUploadMutation,
} from "@zbav-se.me/sdk/mutation/user";
import axios from "axios";
import PQueue from "p-queue";
import descriptions from "./descriptions.json";
import locations from "./location.json";
import titles from "./titles.json";

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

export namespace seedListings {
	export interface Props {
		categories: tCategory[];
		locationIds: string[];
		uploadIds: string[];
	}
}

const generateProsCons = (): string[] | null => {
	const count = rangedom(0, 5);
	if (count === 0) return null;

	const samples = [
		"Výborný stav, jako nové",
		"Původní krabice a příslušenství",
		"Záruka ještě platná",
		"Pravidelná údržba, bez vad",
		"Rychlé jednání, osobní předání",
		"Funguje bez problémů",
		"Sleva oproti novému",
		"Všechny součástky kompletní",
		"Používané s péčí",
		"Možnost výměny",
		"Lehké známky použití",
		"Bez krabice",
		"Chybí některé příslušenství",
		"Starší model",
		"Po záruce",
		"Částečně funkční",
		"Vhodné pro kutily",
		"Známky opotřebení",
	];

	return Array.from(samples)
		.sort(() => Math.random() - 0.5)
		.slice(0, count)
		.map((item) => item.slice(0, 72));
};

const seedListings = async ({ categories, locationIds, uploadIds }: seedListings.Props) => {
	const category = list(categories);
	const title = titles[category.slug as keyof typeof titles] ?? [
		"Random Title",
	];
	const description = list(descriptions.descriptions);

	const allDeliveryMethods = Object.values(tListingDeliveryEnum);
	const deliveryCount = rangedom(0, allDeliveryMethods.length);
	const delivery =
		deliveryCount > 0
			? Array.from(allDeliveryMethods)
					.sort(() => Math.random() - 0.5)
					.slice(0, deliveryCount)
			: null;

	const warranty =
		Math.random() < 0.3
			? null
			: (object(tListingWarrantyEnum) as
					| (typeof tListingWarrantyEnum)[keyof typeof tListingWarrantyEnum]
					| null);

	const pros = generateProsCons();
	const cons = generateProsCons();

	const listing = await apiListingCreate({
		throwOnError: true,
		body: {
			age: rangedom(1, 6),
			condition: rangedom(1, 6),
			categoryId: category.id,
			price: rangedom(0, 99_999),
			priceType: object(tListingPriceEnum),
			title: list(title),
			description: Math.random() < 0.3 ? null : description,
			expiresAt: object(tListingExpireEnum),
			locationId: list(locationIds),
			delivery,
			warranty,
			pros,
			cons,
			uploadIds: Array.from(uploadIds)
				.sort(() => Math.random() - 0.5)
				.slice(0, rangedom(1, Math.min(10, uploadIds.length))),
		},
	}).then((res) => res.data);

	return listing;
};

export const Route = createFileRoute("/$locale/dev/seed")({
	pendingComponent() {
		return (
			<SpinnerContainer
				statusProps={{
					textTitle: "Preparing seed (title)",
				}}
			/>
		);
	},
	async loader({ context: { queryClient } }) {
		const categories = await apiCategoryCollection({
			throwOnError: true,
			body: {
				cursor: {
					page: 0,
					size: 512,
				},
			},
		}).then((res) => res.data.data);

		const locationQueue = new PQueue({
			concurrency: 12,
		});

		const locationIds = await Promise.all<string | undefined>(
			locations.map((locationName) =>
				locationQueue.add(async () => {
					const [result] = await apiLocationAutocomplete({
						throwOnError: true,
						body: {
							lang: "cs",
							text: locationName,
						},
					}).then((res) => res.data);
					return result?.id;
				}),
			),
		).then((ids) => ids.filter((id) => id !== undefined));

		const photos = 64;
		const uploadQueue = new PQueue({
			concurrency: 8,
		});
		const uploadIds = await Promise.all<string>(
			new Array(photos).fill(0).map(() =>
				uploadQueue.add(async () => {
					return withUploadMutation
						.mutate(queryClient, {
							name: "photo.jpg",
							blob: await picsum(),
						})
						.then((data) => data.id);
				}),
			),
		);
		const feed = await withFeedCreateMutation.mutate(queryClient, {
			name: genId(),
			query: {},
		});

		return {
			categories,
			locationIds,
			uploadIds,
			feed,
		};
	},
	component() {
		const { categories, locationIds, uploadIds, feed } = Route.useLoaderData();

		const seedMutation = useMutation({
			mutationKey: [
				"seed",
			],
			async mutationFn() {
				const concurrency = 12;
				const limit = 100_000;

				const queue = new PQueue({
					concurrency,
				});

				for (let i = 0; i < limit; i++) {
					queue.add(async () => {
						return seedListings({
							categories,
							locationIds,
							uploadIds,
						});
					});
				}
				await queue.onIdle();
			},
		});

		const listingEventMutation = withListingEventCreateMutation.useMutation();

		const fetchRandomListings = async () => {
			const sort = list([
				{
					field: "age",
					direction: "desc",
				},
				{
					field: "price",
					direction: "desc",
				},
				{
					field: "condition",
					direction: "desc",
				},
				{
					field: "createdAt",
					direction: "desc",
				},
				{
					field: "updatedAt",
					direction: "desc",
				},
				{
					field: "age",
					direction: "asc",
				},
				{
					field: "price",
					direction: "asc",
				},
				{
					field: "condition",
					direction: "asc",
				},
				{
					field: "createdAt",
					direction: "asc",
				},
				{
					field: "updatedAt",
					direction: "asc",
				},
			] satisfies tListingSort[]);

			const count = await apiListingCount({
				throwOnError: true,
				body: {},
			}).then((res) => res.data.total);

			const size = rangedom(100, 1000);
			const maxPage = Math.max(0, Math.floor(Math.max(count - 1, 0) / size));
			const page = maxPage === 0 ? 0 : rangedom(0, maxPage);

			return apiListingCollection({
				throwOnError: true,
				body: {
					cursor: {
						page,
						size,
					},
					sort: [
						sort,
					],
				},
			}).then((res) => res.data.data);
		};

		const seedScoresMutation = useMutation({
			async mutationFn() {
				const queue = new PQueue({
					concurrency: 12,
				});

				for (const listing of await fetchRandomListings()) {
					Math.random() < 0.5 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "impression",
							});
						});

					Math.random() < 0.2 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "view",
							});
						});

					Math.random() < 0.25 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "ignore",
							});
						});

					Math.random() < 0.1 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "unignore",
							});
						});

					Math.random() < 0.07 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "flag",
							});
						});

					Math.random() < 0.05 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "unflag",
							});
						});

					Math.random() < 0.02 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "transaction",
							});
						});

					Math.random() < 0.175 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "favourite",
							});
						});

					Math.random() < 0.1 &&
						queue.add(async () => {
							return listingEventMutation.mutateAsync({
								listingId: listing.id,
								event: "unfavourite",
							});
						});
				}

				await queue.onIdle();
			},
		});

		const seedFavouriteFlagIgnoreMutation = useMutation({
			async mutationFn() {
				const queue = new PQueue({
					concurrency: 12,
				});

				for (const listing of await fetchRandomListings()) {
					Math.random() < 0.07 &&
						queue.add(async () => {
							return apiFlagToggle({
								body: {
									listingId: listing.id,
									toggle: true,
								},
							});
						});

					Math.random() < 0.175 &&
						queue.add(async () => {
							return apiFavouriteToggle({
								body: {
									feedId: feed.id,
									listingId: listing.id,
									toggle: true,
								},
							});
						});

					Math.random() < 0.25 &&
						queue.add(async () => {
							return apiIgnoreToggle({
								body: {
									listingId: listing.id,
									toggle: true,
								},
							});
						});
				}

				await queue.onIdle();
			},
		});

		return (
			<Container
				data-ui={"Seed-root"}
				ui={{
					layout: "vertical-centered",
					gap: "default",
					height: "full",
				}}
			>
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
						inner: "4xl",
					}}
				>
					<Button
						onClick={() => seedMutation.mutate()}
						disabled={seedMutation.isPending}
						loading={seedMutation.isPending}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					>
						Seed Listings
					</Button>

					<Button
						onClick={() => seedScoresMutation.mutate()}
						disabled={seedScoresMutation.isPending}
						loading={seedScoresMutation.isPending}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					>
						Seed scores
					</Button>

					<Button
						onClick={() => seedFavouriteFlagIgnoreMutation.mutate()}
						disabled={seedFavouriteFlagIgnoreMutation.isPending}
						loading={seedFavouriteFlagIgnoreMutation.isPending}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					>
						Seed favourite/flag/ignore
					</Button>
				</Container>
			</Container>
		);
	},
});
