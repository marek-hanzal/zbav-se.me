import { withMessageTextQueryBuilder as withMessageTextQueryBuilderApp } from "~/app/message-text/db/withMessageTextQueryBuilder";
import type { MessageTextFilterSchema } from "~/app/message-text/schema/MessageTextFilterSchema";
import type { withMessageTextSelect } from "./withMessageTextSelect";

export namespace withMessageTextQueryBuilder {
	export interface Props {
		select: withMessageTextSelect.Select;
		where?: MessageTextFilterSchema.Type;
	}

	export type Callback = (props: Props) => withMessageTextSelect.Select;
}

export const withMessageTextQueryBuilder: withMessageTextQueryBuilder.Callback = ({
	select,
	where,
}) => {
	return withMessageTextQueryBuilderApp({
		select,
		where,
	});
};
