/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client";
import { genId, linkTo } from "@use-pico/common";
import { CurrencyList } from "@zbav-se.me/common";
import {
	apiCategoryCollection,
	apiListingCreate,
	apiLocationAutocomplete,
	ListingExpire,
} from "@zbav-se.me/sdk";
import { Sheet } from "@zbav-se.me/ui";
import axios from "axios";
import PQueue from "p-queue";
import { withUploadMutation } from "~/app/upload/mutation/withUploadMutation";

function range(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
					"Střelice",
					"Jablonec nad Nisou",
					"Litoměřice",
				];

				const queue = new PQueue({
					concurrency: 8,
				});

				const createListing = async () => {
					const upload = await uploadMutation.mutateAsync({
						name: "photo.jpg",
						blob: await picsum().then((res) => res),
					});

					return apiListingCreate({
						age: range(1, 6),
						condition: range(1, 6),
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
						uploadIds: [
							upload.id,
						],
					}).then((res) => res.data);
				};

				const limit = 32;

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
