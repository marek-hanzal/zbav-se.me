import { withMessageTextSelect as withMessageTextSelectApp } from "~/app/message-text/db/withMessageTextSelect";
import type { MessageTextSortSchema } from "~/app/message-text/schema/MessageTextSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageTextSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageTextSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageTextSelect>;
}

export const withMessageTextSelect = ({ database, sort }: withMessageTextSelect.Props) => {
	return withMessageTextSelectApp({
		database,
		sort,
	});
};
