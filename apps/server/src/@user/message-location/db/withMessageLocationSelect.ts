import { withMessageLocationSelect as withMessageLocationSelectApp } from "~/app/message-location/db/withMessageLocationSelect";
import type { MessageLocationSortSchema } from "~/app/message-location/schema/MessageLocationSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageLocationSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageLocationSelect>;
}

export const withMessageLocationSelect = ({ database, sort }: withMessageLocationSelect.Props) => {
	return withMessageLocationSelectApp({
		database,
		sort,
	});
};
