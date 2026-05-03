import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";

export const useNextAttr = (current: DraftAttrOfSchema.Type, attrs: DraftAttrOfSchema.Type[]) => {
	return attrs[attrs.findIndex((item) => item.name === current.name) + 1];
};
