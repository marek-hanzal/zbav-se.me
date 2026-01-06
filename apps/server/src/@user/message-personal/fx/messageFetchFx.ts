import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessagePersonalQueryBuilderFx } from "~/app/message-personal/db/withMessagePersonalQueryBuilderFx";
import { withMessagePersonalSelectFx } from "~/app/message-personal/db/withMessagePersonalSelectFx";
import type { MessagePersonalFilterSchema } from "~/app/message-personal/schema/MessagePersonalFilterSchema";
import type { MessagePersonalQuerySchema } from "~/app/message-personal/schema/MessagePersonalQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace messagePersonalFetchFx {
	export interface Props extends MessagePersonalQuerySchema.Type {
		userId: string;
		scope: MessagePersonalFilterSchema.Type;
	}
}

export const messagePersonalFetchFx = Effect.fn("messagePersonalFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messagePersonalFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message_personal",
		selectFx: withMessagePersonalSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessagePersonalQueryBuilderFx,
	});
});

export type messagePersonalFetchFx = ReturnType<typeof messagePersonalFetchFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<messagePersonalFetchFx>, UserContextFx>>;
