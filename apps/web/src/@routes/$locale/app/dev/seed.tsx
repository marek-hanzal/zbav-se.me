/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client";
import { genId, linkTo } from "@use-pico/common";
import { CurrencyList } from "@zbav-se.me/common";
import {
    type AllowedContentTypes,
    apiCategoryCollection,
    apiCategoryGroupCollection,
    apiListingCreate,
    apiLocationAutocomplete,
    ListingExpire,
} from "@zbav-se.me/sdk";
import axios from "axios";
import PQueue from "p-queue";
import { withListingGalleryCreateMutation } from "~/app/listing/mutation/withListingGalleryCreateMutation";
import { withS3PreSignMutation } from "~/app/s3/mutation/withS3PreSignMutation";
import { Sheet } from "~/app/sheet/Sheet";

function range(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function picsum(): Promise<{
	data: Blob;
	contentType: string;
	ext: "jpg";
}> {
	const sig = genId();

	const proxy = linkTo({
		base: import.meta.env.VITE_SERVER_API,
		href: "/api/cors-proxy",
	});

	const target = linkTo({
		base: "https://picsum.photos",
		href: `/seed/${sig}/1024/768.jpg`,
	});

	const proxied = `${proxy}?url=${encodeURIComponent(target)}`;

	const result = await axios.get<Blob>(proxied, {
		responseType: "blob",
		maxRedirects: 0,
		timeout: 10_000,
	});

	const contentType =
		result.headers["content-type"] || result.data.type || "image/jpeg";

	return {
		data: result.data,
		contentType,
		ext: "jpg",
	};
}

export const Route = createFileRoute("/$locale/app/dev/seed")({
	component() {
		const preSignMutation = withS3PreSignMutation.useMutation();
		const createListingGalleryMutation =
			withListingGalleryCreateMutation.useMutation();

		const seedMutation = useMutation({
			mutationKey: [
				"seed",
			],
			async mutationFn() {
				const categoryGroup = await apiCategoryGroupCollection({}).then(
					(res) => res.data,
				);
				const category = await apiCategoryCollection({}).then(
					(res) => res.data,
				);
				const locations = [
					"Praha",
					"Brno",
					"Ostrava",
					"Plzeň",
					"Liberec",
					"Olomouc",
					"Ústí nad Labem",
					"Hradec Králové",
					"České Budějovice",
					"Zlín",
					"Pardubice",
					"Jihlava",
					"Karlovy Vary",
					"Teplice",
					"Děčín",
					"Chomutov",
					"Frýdek-Místek",
					"Mladá Boleslav",
					"Tábor",
					"Kroměříž",
					"Uherské Hradiště",
					"Znojmo",
					"Havlíčkův Brod",
					"Cheb",
					"Trutnov",
					"Kolín",
					"Opava",
					"Písek",
					"Jablonec nad Nisou",
					"Litoměřice",
				];

				const queue = new PQueue({
					concurrency: 8,
				});

				const createListing = async () => {
					const listing = await apiListingCreate({
						age: range(1, 6),
						condition: range(1, 6),
						categoryGroupId:
							categoryGroup[range(0, categoryGroup.length - 1)]!
								.id,
						categoryId: category[range(0, category.length - 1)]!.id,
						price: range(0, 99_999),
						currency:
							CurrencyList[range(0, CurrencyList.length - 1)]!,
						expiresAt:
							ListingExpire[
								Object.keys(ListingExpire)[
									range(
										0,
										Object.keys(ListingExpire).length - 1,
									)
								] as keyof typeof ListingExpire
							],
						locationId: await apiLocationAutocomplete({
							lang: "cs",
							text: locations[range(0, locations.length - 1)]!,
						}).then((res) => res.data[0]!.id),
					}).then((res) => res.data);

					const photo = await picsum();

					const presign = await preSignMutation.mutateAsync({
						path: `listing/${listing.id}`,
						extension: "jpeg",
						contentType: photo.contentType as AllowedContentTypes,
					});

					await axios.put(presign.url, photo.data, {
						headers: {
							"Content-Type": photo.contentType,
						},
					});

					await createListingGalleryMutation.mutateAsync({
						listingId: listing.id,
						sort: 0,
						url: linkTo({
							base: "https://content.zbav-se.me",
							href: presign.path,
						}),
					});

					return listing;
				};

				const limit = 16;

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
