import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { Effect } from "effect";
import type { z } from "zod";

export namespace McpToolDefinition {
	export interface Example<out TArguments> {
		arguments: TArguments;
		description: string;
		title: string;
	}

	export interface Context {
		traceId: string;
		userId: string;
	}

	export interface Definition<
		TInputSchema extends z.ZodType,
		out TOutputSchema extends z.ZodType,
	> {
		annotations: ToolAnnotations;
		description: string;
		examples: Example<z.output<TInputSchema>>[];
		inputSchema: TInputSchema;
		name: string;
		namespace: string;
		outputSchema: TOutputSchema;
		title: string;
		execute(
			args: z.output<TInputSchema>,
			context: Context,
		): Effect.Effect<z.output<TOutputSchema>, unknown, any>;
	}
}
