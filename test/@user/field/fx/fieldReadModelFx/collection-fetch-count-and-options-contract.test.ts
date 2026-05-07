import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { fieldCollectionFx } from "~/user/field/server/fx/fieldCollectionFx";
import { fieldCountFx } from "~/user/field/server/fx/fieldCountFx";
import { fieldFetchFx } from "~/user/field/server/fx/fieldFetchFx";

describe("field read model", () => {
	it("filters, sorts, fetches, counts, and expands field options consistently", async () => {
		const database = await testabase("field-read-model-contract");

		return Effect.gen(function* () {
			const enumFields = yield* fieldCollectionFx({
				scope: {},
				where: {
					idIn: [
						"storage",
						"ram",
					],
					type: "enum-single",
				},
				sort: [
					{
						field: "name",
						order: "asc",
					},
				],
				limit: 10,
			});
			const colorField = yield* fieldFetchFx({
				scope: {},
				where: {
					name: "color",
				},
			});
			const textFieldCount = yield* fieldCountFx({
				scope: {},
				where: {
					type: "text",
				},
			});
			const textFieldCollection = yield* fieldCollectionFx({
				scope: {},
				cursor: {
					page: 0,
					size: 100,
				},
				where: {
					type: "text",
				},
				sort: [
					{
						field: "name",
						order: "asc",
					},
				],
			});
			const missingField = yield* Effect.either(
				fieldFetchFx({
					scope: {},
					where: {
						id: "missing-field",
					},
				}),
			);

			expect(enumFields.map((item) => item.name)).toEqual([
				"ram",
				"storage",
			]);
			expect(enumFields[0]?.options.map((item) => item.value)).toEqual([
				"4 GB or less",
				"8 GB",
				"16 GB",
				"32 GB",
				"64 GB or more",
			]);
			expect(enumFields[1]?.options.map((item) => item.sort)).toEqual([
				0,
				1,
				2,
				3,
				4,
				5,
			]);
			expect(colorField.name).toBe("color");
			expect(colorField.type).toBe("enum-multi");
			expect(colorField.options[0]?.value).toBe("black");
			expect(colorField.options.at(-1)?.value).toBe("multicolor");
			expect(textFieldCount).toBe(textFieldCollection.length);
			expect(textFieldCollection.every((item) => item.type === "text")).toBe(true);
			expectTaggedErrorFx(missingField, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
