import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { fieldOptionCollectionFx } from "~/user/field-option/server/fx/fieldOptionCollectionFx";
import { fieldOptionCountFx } from "~/user/field-option/server/fx/fieldOptionCountFx";
import { fieldOptionFetchFx } from "~/user/field-option/server/fx/fieldOptionFetchFx";

describe("field option read model", () => {
	it("filters, sorts, fetches, and counts field options consistently", async () => {
		const database = await testabase("field-option-read-model-contract");

		return Effect.gen(function* () {
			const ramOptions = yield* fieldOptionCollectionFx({
				scope: {},
				where: {
					fieldId: "ram",
				},
				sort: [
					{
						field: "sort",
						order: "desc",
					},
				],
				limit: 10,
			});
			const selectedOptions = yield* fieldOptionCollectionFx({
				scope: {},
				where: {
					idIn: [
						"color",
						"storage",
					],
					sort: 0,
				},
				sort: [
					{
						field: "fieldId",
						order: "asc",
					},
				],
				limit: 10,
			});
			const fetchedOption = yield* fieldOptionFetchFx({
				scope: {},
				where: {
					fieldId: "storage",
					value: "512 GB",
				},
			});
			const storageCount = yield* fieldOptionCountFx({
				scope: {},
				where: {
					fieldId: "storage",
				},
			});
			const storageCollection = yield* fieldOptionCollectionFx({
				scope: {},
				where: {
					fieldId: "storage",
				},
				sort: [
					{
						field: "sort",
						order: "asc",
					},
				],
				limit: 20,
			});
			const missingOption = yield* Effect.either(
				fieldOptionFetchFx({
					scope: {},
					where: {
						fieldId: "storage",
						value: "missing-value",
					},
				}),
			);

			expect(ramOptions.map((item) => item.sort)).toEqual([
				4,
				3,
				2,
				1,
				0,
			]);
			expect(ramOptions[0]?.value).toBe("64 GB or more");
			expect(selectedOptions.map((item) => `${item.fieldId}:${item.value}`)).toEqual([
				"color:black",
				"storage:64 GB or less",
			]);
			expect(fetchedOption.fieldId).toBe("storage");
			expect(fetchedOption.value).toBe("512 GB");
			expect(fetchedOption.sort).toBe(3);
			expect(storageCount).toBe(storageCollection.length);
			expect(storageCollection.map((item) => item.value)).toEqual([
				"64 GB or less",
				"128 GB",
				"256 GB",
				"512 GB",
				"1 TB",
				"2 TB or more",
			]);
			expectTaggedErrorFx(missingOption, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
