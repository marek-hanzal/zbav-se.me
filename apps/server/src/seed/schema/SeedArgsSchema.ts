import { z } from "@hono/zod-openapi";
import { cac } from "cac";
import { Effect } from "effect";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export const SeedArgsSchema = z.object({
	count: z.coerce.number().int().positive(),
	user: z.email(),
});

export type SeedArgsSchema = typeof SeedArgsSchema;

export namespace SeedArgsSchema {
	export type Type = z.infer<SeedArgsSchema>;
}

export const parseSeedArgsFx = Effect.fn("parseSeedArgsFx")(function* (input: {
	name: string;
	args: string[];
}) {
	const cli = cac(input.name);
	cli.option("--count <count>", "Number of records/scenarios to generate in this run");
	cli.option("--user <email>", "User email");
	cli.help();

	const parsedCli = cli.parse(
		[
			"bun",
			input.name,
			...input.args,
		],
		{
			run: false,
		},
	);

	if (parsedCli.options.help) {
		return (yield* Effect.sync(() => {
			process.exit(0);
		})) as never;
	}

	return yield* Effect.try({
		try: () =>
			SeedArgsSchema.parse({
				count: parsedCli.options.count,
				user: parsedCli.options.user,
			}),
		catch: () =>
			new InvalidRequestErrorFx({
				message: "Invalid arguments. Required: --count <positive-int> --user <email>",
			}),
	});
});

export type parseSeedArgsFx = ReturnType<typeof parseSeedArgsFx>;
