import { createFileRoute } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { withListingQuery } from "~/public/listing/query/withListingQuery";
import { withTranslationMiddleware } from "~/server/middleware/withTranslationMiddleware";
import { listingAttrOfFn } from "~/common/listing-attr/fn/listingAttrOfFn";

export const Route = createFileRoute("/$locale/z/{$id}.md")({
	server: {
		middleware: [
			withTranslationMiddleware,
		],
		handlers: {
			async GET({ context: { translator }, params: { locale, id } }) {
				const listing = await withListingQuery.fetchFn({
					where: {
						id,
					},
				});

				const md: string[] = [];

				md.push(`# ${listing.title}\n`);

				md.push(`${listing.category.category} / ${listing.category.group}\n`);

				match(listing.priceType)
					.with("fixed", "haggle", (priceType) => {
						md.push(
							`${translator.text(`Listing price - ${priceType}`)} | ${toLocaleNumber({
								locale,
								number: listing.price,
							})} ${listing.currency}`,
						);
					})
					.with("ask", "free", "haulaway", (priceType) => {
						md.push(translator.text(`Listing price - ${priceType}`));
					})
					.exhaustive();

				md.push(`${listing.location.address}\n`);

				md.push(`### ${translator.text("Listing gallery (label)")}`);
				listing.withImageUrl.forEach((url) => {
					md.push(`- ${url}`);
				});

				if (listing.description) {
					md.push(`### ${translator.text("Listing description (label)")}`);
					md.push(listing.description);
				}

				if (listing.delivery.length) {
					md.push(`\n### ${translator.text("Listing delivery (label)")}`);
					listing.delivery.forEach((item) => {
						md.push(`- ${item}`);
					});
				}

				if (listing.pros.length) {
					md.push(`\n### ${translator.text("Listing - Pros (label)")}`);
					listing.pros.forEach((value) => {
						md.push(`- ${value}`);
					});
				}

				if (listing.cons.length) {
					md.push(`\n### ${translator.text("Listing - Cons (label)")}`);
					listing.cons.forEach((value) => {
						md.push(`- ${value}`);
					});
				}

				const attrs = (
					await listingAttrOfFn({
						data: {
							listingId: listing.id,
							categoryId: listing.categoryId,
						},
					})
				)
					.filter((attr) => {
						return attr.value !== null && attr.value !== undefined;
					})
					.filter((attr) => {
						if (Array.isArray(attr.value) && !attr.value.length) {
							return false;
						}

						return true;
					});

				if (attrs.length) {
					md.push(`\n### ${translator.text("Listing - extras (label)")}`);
					md.push(
						`| ${translator.text("Extra attr - label (label)")} | ${translator.text("Extra attr - value (label)")} |`,
					);
					md.push("| - | - |");
					attrs.forEach((attr) => {
						md.push(
							`| ${translator.text(`Field - ${attr.name}`)} | ${match(attr)
								.with(
									{
										type: "number",
									},
									{
										type: "decimal",
									},
									{
										type: "range",
									},
									(attr) => {
										return toLocaleNumber({
											number: attr.value,
											locale,
										});
									},
								)
								.with(
									{
										type: "year",
									},
									(attr) => {
										return attr.value;
									},
								)
								.with(
									{
										type: "text",
									},
									(attr) => {
										return attr.value;
									},
								)
								.with(
									{
										type: "enum-single",
									},
									(attr) => {
										return attr.value;
									},
								)
								.with(
									{
										type: "enum-multi",
									},
									(attr) => {
										return attr.value.map(item => translator.text(`${attr.name} - ${item}`, item)).join(", ")
									},
								)
								.exhaustive()} |`,
						);
					});
				}

				return new Response(md.join("\n"), {
					headers: {
						"content-type": "text/markdown; charset=utf-8",
					},
				});
			},
		},
	},
});
