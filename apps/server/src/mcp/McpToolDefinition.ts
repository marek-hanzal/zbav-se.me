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
		entityResourceUris: string[];
		examples: Example<z.output<TInputSchema>>[];
		fieldResourceUris: string[];
		guideResourceUris: string[];
		inputSchema: TInputSchema;
		name: string;
		namespace: string;
		outputSchema: TOutputSchema;
		profileResourceUris: string[];
		role: string;
		title: string;
		workflowHint: string;
		execute(
			args: z.output<TInputSchema>,
			context: Context,
		): Effect.Effect<z.output<TOutputSchema>, unknown, any>;
	}
}
