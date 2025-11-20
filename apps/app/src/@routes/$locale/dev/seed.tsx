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
	apiListingCartToggle,
	apiListingCollection,
	apiListingCount,
	apiListingCreate,
	apiListingFlagToggle,
	apiListingIgnoreToggle,
	tCurrencyList,
	tListingExpire,
	type tListingSort,
} from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation, withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import axios from "axios";
import PQueue from "p-queue";
import { withEmailSignInMutation } from "~/app/auth/withEmailSignInMutation";
import { withRegisterMutation } from "~/app/auth/withRegisterMutation";
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

const seedListings = async ({ categories, locationIds, uploadIds }: seedListings.Props) => {
	const currencies = Object.values(tCurrencyList);
	const category = list(categories);
	const title = titles[category.slug as keyof typeof titles] ?? [
		"Random Title",
	];

	const listing = await apiListingCreate({
		throwOnError: true,
		body: {
			age: rangedom(1, 6),
			condition: rangedom(1, 6),
			categoryId: category.id,
			price: rangedom(0, 99_999),
			currency: list(currencies),
			title: list(title),
			expiresAt: object(tListingExpire),
			locationId: list(locationIds),
			uploadIds: [
				list(uploadIds),
			],
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

		const photos = 128;
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

		return {
			categories,
			locationIds,
			uploadIds,
		};
	},
	component() {
		const { categories, locationIds, uploadIds } = Route.useLoaderData();

		const seedMutation = useMutation({
			mutationKey: [
				"seed",
			],
			async mutationFn() {
				const concurrency = 12;
				const limit = 500;

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

		const registerMutation = withRegisterMutation.useMutation();
		const registerUsersMutation = useMutation({
			async mutationFn() {
				const concurrency = 4;
				const alphabet = Array.from(
					{
						length: 26,
					},
					(_, index) => String.fromCharCode("a".charCodeAt(0) + index),
				);

				const queue = new PQueue({
					concurrency,
				});

				for (const letter of alphabet) {
					queue.add(() =>
						registerMutation.mutateAsync({
							email: `${letter}@x32.cz`,
							password: "12345678",
						}),
					);
				}

				await queue.onIdle();
			},
		});

		const signInMutation = withEmailSignInMutation.useMutation();

		const listingScoreMutation = withListingScoreCreateMutation.useMutation();

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
							return listingScoreMutation.mutateAsync({
								listingId: listing.id,
								score: "listing",
							});
						});

					Math.random() < 0.2 &&
						queue.add(async () => {
							return listingScoreMutation.mutateAsync({
								listingId: listing.id,
								score: "view",
							});
						});

					Math.random() < 0.07 &&
						queue.add(async () => {
							return listingScoreMutation.mutateAsync({
								listingId: listing.id,
								score: "flag",
							});
						});

					Math.random() < 0.175 &&
						queue.add(async () => {
							return listingScoreMutation.mutateAsync({
								listingId: listing.id,
								score: "cart",
							});
						});

					Math.random() < 0.25 &&
						queue.add(async () => {
							return listingScoreMutation.mutateAsync({
								listingId: listing.id,
								score: "ignore",
							});
						});
				}

				await queue.onIdle();
			},
		});

		const seedCartFlagIgnoreMutation = useMutation({
			async mutationFn() {
				const queue = new PQueue({
					concurrency: 12,
				});

				for (const listing of await fetchRandomListings()) {
					Math.random() < 0.07 &&
						queue.add(async () => {
							return apiListingFlagToggle({
								body: {
									listingId: listing.id,
									toggle: true,
								},
							});
						});

					Math.random() < 0.175 &&
						queue.add(async () => {
							return apiListingCartToggle({
								body: {
									listingId: listing.id,
									toggle: true,
								},
							});
						});

					Math.random() < 0.25 &&
						queue.add(async () => {
							return apiListingIgnoreToggle({
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
				layout={"vertical-centered"}
				items={"center"}
				gap={"md"}
				tone={"secondary"}
				theme={"light"}
			>
				<div className={"space-y-2"}>
					<Button
						loading={registerUsersMutation.isPending}
						onClick={() => {
							registerUsersMutation.mutate();
						}}
						tone={"secondary"}
						theme={"dark"}
						size={"xl"}
						full
					>
						Prepare users
					</Button>

					<Button
						loading={signInMutation.isPending}
						onClick={() => {
							const letter = String.fromCharCode("a".charCodeAt(0) + rangedom(0, 25));

							signInMutation.mutate({
								email: `${letter}@x32.cz`,
								password: "12345678",
							});
						}}
						tone={"secondary"}
						theme={"dark"}
						size={"xl"}
						full
					>
						Random user
					</Button>

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
						full
					>
						Seed Listings
					</Button>

					<Button
						onClick={() => seedScoresMutation.mutate()}
						disabled={seedScoresMutation.isPending}
						loading={seedScoresMutation.isPending}
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
						full
					>
						Seed scores
					</Button>

					<Button
						onClick={() => seedCartFlagIgnoreMutation.mutate()}
						disabled={seedCartFlagIgnoreMutation.isPending}
						loading={seedCartFlagIgnoreMutation.isPending}
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
						full
					>
						Seed cart/flag/ignore
					</Button>
				</div>
			</Container>
		);
	},
});
