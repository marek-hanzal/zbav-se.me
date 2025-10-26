import type { UploadQuerySchema } from "./schema/UploadQuerySchema";
import type { withUploadSelect } from "./withUploadSelect";

export namespace withUploadQueryBuilder {
	export interface Props {
		select: withUploadSelect.Select;
		where?: UploadQuerySchema.Type["where"];
		sort?: UploadQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withUploadSelect.Select;
}

export const withUploadQueryBuilder: withUploadQueryBuilder.Callback = ({
	select,
	where,
}) => {
	let query = select;

	if (where?.id) {
		query = query.where("u.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("u.id", "in", where.idIn);
	}

	return query;
};

export const withUploadQueryBuilderWithSort = (
	props: withUploadQueryBuilder.Props,
) => {
	let query = withUploadQueryBuilder(props);

	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "createdAt":
					query = query.orderBy("u.createdAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
