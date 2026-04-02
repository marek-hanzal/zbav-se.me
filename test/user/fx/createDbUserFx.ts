import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace createDbUserFx {
	export interface Props {
		email: string;
		name: string;
	}
}

export const createDbUserFx = Effect.fn("createDbUserFx")(function* ({
	email,
	name,
}: createDbUserFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const now = new Date();

	return yield* tryDbFx(async () =>
		kysely
			.insertInto("user")
			.values({
				id: genId(),
				email,
				name,
				emailVerified: false,
				image: null,
				createdAt: now,
				updatedAt: now,
			})
			.returningAll()
			.executeTakeFirstOrThrow(),
	);
});
