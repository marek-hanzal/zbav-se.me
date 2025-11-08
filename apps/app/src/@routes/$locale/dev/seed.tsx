/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { genId } from "@use-pico/common/gen-id";
import { linkTo } from "@use-pico/common/link-to";
import { list, object, rangedom } from "@use-pico/common/rangedom";
import {
	apiCategoryCollection,
	apiListingCreate,
	apiLocationAutocomplete,
	tCurrencyList,
	tListingExpire,
} from "@zbav-se.me/sdk/api/session";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { Sheet } from "@zbav-se.me/ui/sheet";
import axios from "axios";
import PQueue from "p-queue";
import locations from "./location.json";

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
		categoryIds: string[];
		locationIds: string[];
		uploadIds: string[];
	}
}

const seedListings = async ({
	categoryIds,
	locationIds,
	uploadIds,
}: seedListings.Props) => {
	const currencies = Object.values(tCurrencyList);
	return apiListingCreate({
		throwOnError: true,
		body: {
			age: rangedom(1, 6),
			condition: rangedom(1, 6),
			categoryId: list(categoryIds),
			price: rangedom(0, 99_999),
			currency: list(currencies),
			title: "andomTitle()",
			expiresAt: object(tListingExpire),
			locationId: list(locationIds),
			uploadIds: [
				list(uploadIds),
			],
		},
	}).then((res) => res.data);
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
		const categoryIds = await apiCategoryCollection({
			throwOnError: true,
			body: {
				cursor: {
					page: 0,
					size: 512,
				},
			},
		}).then((res) => res.data.data.map((category) => category.id));

		const locationQueue = new PQueue({
			concurrency: 8,
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
			categoryIds,
			locationIds,
			uploadIds,
		};
	},
	component() {
		const { categoryIds, locationIds, uploadIds } = Route.useLoaderData();

		const seedMutation = useMutation({
			mutationKey: [
				"seed",
			],
			async mutationFn() {
				const concurrency = 4;
				const limit = 5_000;

				const queue = new PQueue({
					concurrency,
				});

				for (let i = 0; i < limit; i++) {
					queue.add(async () => {
						return seedListings({
							categoryIds,
							locationIds,
							uploadIds,
						});
					});
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
