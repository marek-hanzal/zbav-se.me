import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";

export const useNextAttr = (current: AttrOfSchema.Type, attrs: AttrOfSchema.Type[]) => {
	return attrs[attrs.findIndex((item) => item.name === current.name) + 1];
};
