import type { UploadFilterSchema } from "~/app/upload/schema/UploadFilterSchema";
import type { withUploadSelectFx } from "./withUploadSelectFx";

export namespace withUploadQueryBuilder {
	export interface Props {
		select: withUploadSelectFx.Select;
		where?: UploadFilterSchema.Type;
	}

	export type Callback = (props: Props) => withUploadSelectFx.Select;
}

export const withUploadQueryBuilder: withUploadQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("u.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("u.id", "in", where.idIn);
	}

	return query;
};
