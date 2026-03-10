import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { CommonSchema } from "~/database/@table/TransactionEntryTableSchema/CommonSchema";
import { GallerySchema } from "~/database/@table/TransactionEntryTableSchema/GallerySchema";
import { LocationSchema } from "~/database/@table/TransactionEntryTableSchema/LocationSchema";
import { PackageSchema } from "~/database/@table/TransactionEntryTableSchema/PackageSchema";
import { PersonalSchema } from "~/database/@table/TransactionEntryTableSchema/PersonalSchema";
import { TextSchema } from "~/database/@table/TransactionEntryTableSchema/TextSchema";

const DirectionShape = {
	direction: TransactionEntryDirectionEnumSchema.openapi({
		description: "Direction of the entry relative to the current user",
	}),
};

export const TransactionEntrySchema = z.discriminatedUnion("kind", [
	z
		.looseObject({
			...TextSchema.shape,
			...DirectionShape,
		})
		.strip(),
	z
		.looseObject({
			...GallerySchema.shape,
			...DirectionShape,
		})
		.strip(),
	z
		.looseObject({
			...LocationSchema.shape,
			...DirectionShape,
		})
		.strip(),
	z
		.looseObject({
			...PackageSchema.shape,
			...DirectionShape,
		})
		.strip(),
	z
		.looseObject({
			...PersonalSchema.shape,
			...DirectionShape,
		})
		.strip(),
	z
		.looseObject({
			...CommonSchema.shape,
			...DirectionShape,
		})
		.strip(),
]).openapi("TransactionEntry", {
	description: "Transaction timeline entry",
});

export type TransactionEntrySchema = typeof TransactionEntrySchema;

export namespace TransactionEntrySchema {
	export type Type = z.infer<TransactionEntrySchema>;
}
