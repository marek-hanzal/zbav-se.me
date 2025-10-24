/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
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

async function unsplash(): Promise<{
	data: Buffer;
	contentType: string;
	ext: "jpg";
}> {
	const topics = [
		"electronics",
		"home",
		"tools",
		"clothes",
		"gadget",
		"device",
	] as const;
	const topic = topics[range(0, topics.length - 1)]!;

	const sig = genId();
	const url = linkTo({
		base: "https://source.unsplash.com",
		href: `/featured/1024x768/${topic}`,
		query: {
			sig,
		},
	});

	const result = await axios.get<ArrayBuffer>(url, {
		responseType: "arraybuffer",
		maxRedirects: 5,
	});
	return {
		data: Buffer.from(result.data),
		contentType: "image/jpeg",
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
					"Nejdek",
					"Pičín",
					"Berlín",
				];

				const queue = new PQueue({
					concurrency: 3,
				});

				const createListing = async () => {
					const listing = await apiListingCreate({
						age: range(1, 6),
						condition: range(1, 6),
						categoryGroupId:
							categoryGroup[range(0, categoryGroup.length - 1)]!
								.id,
						categoryId: category[range(0, category.length - 1)]!.id,
						price: range(0, 10000),
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

					const photo = await unsplash();

					const presign = await preSignMutation.mutateAsync({
						path: `listing/${listing.id}`,
						extension: "jpeg",
						contentType: photo.contentType as AllowedContentTypes,
					});

					await axios.put(presign.url, photo, {
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

				for (let i = 0; i < 10; i++) {
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
