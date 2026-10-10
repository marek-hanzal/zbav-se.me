import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { fieldCreateFx } from "~/user-field/fx/fieldCreateFx";
import { fieldFetchFx } from "~/user-field/fx/fieldFetchFx";
import { fieldOptionCreateFx } from "~/user-field-option/fx/fieldOptionCreateFx";
import { fieldOptionFetchFx } from "~/user-field-option/fx/fieldOptionFetchFx";

describe("field create fx", () => {
	it("creates a field and field options that are immediately readable through fetch wrappers", async () => {
		const database = await testabaseFn("field-create-and-option-create-contract");

		return Effect.gen(function* () {
			const field = yield* fieldCreateFx({
				name: "codex-test-memory-tier",
				type: "enum-single",
				min: null,
				max: null,
				step: null,
			});

			const firstOption = yield* fieldOptionCreateFx({
				fieldId: field.name,
				value: "starter",
				sort: 0,
			});
			const secondOption = yield* fieldOptionCreateFx({
				fieldId: field.name,
				value: "pro",
				sort: 1,
			});

			const fetchedField = yield* fieldFetchFx({
				scope: {},
				where: {
					name: field.name,
				},
			});
			const fetchedOption = yield* fieldOptionFetchFx({
				scope: {},
				where: {
					fieldId: field.name,
					value: secondOption.value,
				},
			});

			expect(field.name).toBe("codex-test-memory-tier");
			expect(field.type).toBe("enum-single");
			expect(firstOption.fieldId).toBe(field.name);
			expect(secondOption.sort).toBe(1);
			expect(fetchedField.options.map((item) => item.value)).toEqual([
				"starter",
				"pro",
			]);
			expect(fetchedOption.fieldId).toBe(field.name);
			expect(fetchedOption.value).toBe("pro");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
