import type { ListingAttrOfSchema } from "~/user/listing-attr/server/schema/ListingAttrOfSchema";

export const useNextAttr = (current: ListingAttrOfSchema.Type, attrs: ListingAttrOfSchema.Type[]) => {
	return attrs[attrs.findIndex((item) => item.name === current.name) + 1];
};
