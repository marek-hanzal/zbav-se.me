import { createFileRoute } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { listingAttrOfFn } from "~/listing-attr/fn/listingAttrOfFn";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { withListingQuery } from "~/public-listing/query/withListingQuery";
import { withTranslationMiddleware } from "~/request-middleware/middleware/withTranslationMiddleware";

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
							`${translator.textFn(`Listing price - ${priceType}`)} | ${toLocaleNumberFn(
								{
									locale,
									number: listing.price,
								},
							)} ${listing.currency}`,
						);
					})
					.with("ask", "free", "haulaway", (priceType) => {
						md.push(translator.textFn(`Listing price - ${priceType}`));
					})
					.exhaustive();

				md.push(`${listing.location.address}\n`);

				md.push(`### ${translator.textFn("Listing gallery (label)")}`);
				listing.withImageUrl.forEach((url) => {
					md.push(`- ${url}`);
				});

				if (listing.description) {
					md.push(`### ${translator.textFn("Listing description (label)")}`);
					md.push(listing.description);
				}

				if (listing.delivery.length) {
					md.push(`\n### ${translator.textFn("Listing delivery (label)")}`);
					listing.delivery.forEach((item) => {
						md.push(`- ${item}`);
					});
				}

				if (listing.pros.length) {
					md.push(`\n### ${translator.textFn("Listing - Pros (label)")}`);
					listing.pros.forEach((value) => {
						md.push(`- ${value}`);
					});
				}

				if (listing.cons.length) {
					md.push(`\n### ${translator.textFn("Listing - Cons (label)")}`);
					listing.cons.forEach((value) => {
						md.push(`- ${value}`);
					});
				}

				const attrs = await listingAttrOfFn({
					data: {
						listingId: listing.id,
						categoryId: listing.categoryId,
						nonEmpty: true,
					},
				});

				if (attrs.length) {
					md.push(`\n### ${translator.textFn("Listing - extras (label)")}`);
					md.push(
						`| ${translator.textFn("Extra attr - label (label)")} | ${translator.textFn("Extra attr - value (label)")} |`,
					);
					md.push("| - | - |");
					attrs.forEach((attr) => {
						md.push(
							`| ${translator.textFn(`Field - ${attr.name}`)} | ${match(attr)
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
										return toLocaleNumberFn({
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
										return attr.value
											.map((item) =>
												translator.textFn(`${attr.name} - ${item}`, item),
											)
											.join(", ");
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
