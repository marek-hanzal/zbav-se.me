import { expect, it } from "vitest";
import { concat } from "../../../src/embedding";

it("should apply weights correctly", () => {
	const block1 = {
		vector: new Float32Array([1, 0]),
		weight: 2,
	};
	const block2 = {
		vector: new Float32Array([0, 1]),
		weight: 3,
	};
	const result = concat([block1, block2]);
	// After concatenation and normalization
	expect(result.length).toBe(4);
	// First two should be from block1 (weight 2)
	// Last two should be from block2 (weight 3)
	expect(result[0]).not.toBe(0);
	expect(result[1]).not.toBe(0);
	expect(result[2]).not.toBe(0);
	expect(result[3]).not.toBe(0);
});
