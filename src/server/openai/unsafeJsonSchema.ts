import type { z } from "zod";

/**
 * This piece of shit is here, because OpenAI Agents SDK generates total crap out of Zod schemas (json),
 * so we need native Zod ability to generate proper JSON schema, but in that case types are totally fucked
 * up in tool definitions, so this tool.
 *
 * The hack is:
 * Yes, we're strict
 * Yes, we're returning JSON schema (everybody is happy)
 * Yes, we're lying that output is Zod (thus tool types and rest of type things works properly)
 *
 * Uglier than shit, but... it works.
 *
 * @note This turns off SDK validator, so you _must_ validate manually when using this "helper".
 */
export const unsafeJsonSchema = <TSchema extends z.ZodObject>(input: TSchema) => {
	return input.toJSONSchema() as unknown as TSchema;
};
