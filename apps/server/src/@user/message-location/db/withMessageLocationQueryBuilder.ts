import { withMessageLocationQueryBuilder as withMessageLocationQueryBuilderApp } from "~/app/message-location/db/withMessageLocationQueryBuilder";
import type { MessageLocationFilterSchema } from "~/app/message-location/schema/MessageLocationFilterSchema";
import type { withMessageLocationSelect } from "./withMessageLocationSelect";

export namespace withMessageLocationQueryBuilder {
	export interface Props {
		select: withMessageLocationSelect.Select;
		where?: MessageLocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageLocationSelect.Select;
}

export const withMessageLocationQueryBuilder: withMessageLocationQueryBuilder.Callback = ({
	select,
	where,
}) => {
	return withMessageLocationQueryBuilderApp({
		select,
		where,
	});
};
