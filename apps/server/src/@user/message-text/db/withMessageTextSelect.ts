import { withMessageTextSelect as withMessageTextSelectApp } from "~/app/message/db/withMessageSelect";
import type { MessageSortSchema } from "~/app/message/schema/MessageSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageTextSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageTextSelect>;
}

export const withMessageTextSelect = ({ database, sort }: withMessageTextSelect.Props) => {
	return withMessageTextSelectApp({
		database,
		sort,
	});
};
