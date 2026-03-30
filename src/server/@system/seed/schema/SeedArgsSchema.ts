import { cac } from "cac";
import { Effect } from "effect";
import { z } from "zod";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

export const SeedArgsSchema = z
	.object({
		count: z.coerce.number().int().positive(),
		user: z.email(),
	})
	.meta({
		id: "SeedArgs",
		description: "CLI arguments for seed commands.",
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
		return yield* Effect.sync(() => {
			process.exit(0);
		});
	}

	return yield* Effect.try({
		try: () => {
			return SeedArgsSchema.parse({
				count: parsedCli.options.count,
				user: parsedCli.options.user,
			});
		},
		catch: () => {
			return new InvalidRequestErrorFx({
				message: "Invalid arguments. Required: --count <positive-int> --user <email>",
			});
		},
	});
});

export type parseSeedArgsFx = ReturnType<typeof parseSeedArgsFx>;
