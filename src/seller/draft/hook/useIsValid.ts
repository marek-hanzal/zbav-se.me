import { useLogger } from "~/common/log/hook/useLogger";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { DraftSchema } from "../server/schema/DraftSchema";

export namespace useIsValid {
	export interface Props {
		draft: DraftSchema.Type;
	}
}

export const useIsValid = ({ draft }: useIsValid.Props) => {
	const logger = useLogger({
		name: [
			"hook",
			"draft",
			"useIsValid",
		],
	});

	const data = {
		...draft,
		uploadIds: draft.withUploadIds,
		draftId: draft.id,
	};
	const isValid = ListingCreateSchema.safeParse(data);

	logger.trace("Result", {
		draft,
		data,
		isValid: isValid,
		error: isValid.error,
	});

	return {
		isValid: isValid.success,
		data: isValid.data,
	} as
		| {
				isValid: true;
				data: ListingCreateSchema.Type;
		  }
		| {
				isValid: false;
				data: undefined;
		  };
};
