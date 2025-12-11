import { withMessageTextQueryBuilder as withMessageTextQueryBuilderApp } from "~/app/message/db/withMessageQueryBuilder";
import type { MessageFilterSchema } from "~/app/message/schema/MessageFilterSchema";
import type { withMessageTextSelect } from "./withMessageTextSelect";

export namespace withMessageTextQueryBuilder {
	export interface Props {
		select: withMessageTextSelect.Select;
		where?: MessageFilterSchema.Type;
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
