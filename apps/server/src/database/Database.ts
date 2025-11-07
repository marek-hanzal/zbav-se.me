import type { CategoryDbSchema } from "../@session/category/schema/CategoryDbSchema";
import type { CategoryMissDbSchema } from "../@session/category/schema/CategoryMissDbSchema";
import type { CategorySpotlightDbSchema } from "../@session/category/schema/CategorySpotlightDbSchema";
import type { FeedDbSchema } from "../@session/feed/schema/FeedDbSchema";
import type { GalleryDbSchema } from "../@session/gallery/schema/GalleryDbSchema";
import type { ListingDbSchema } from "../@session/listing/schema/ListingDbSchema";
import type { ListingCartDbSchema } from "../@session/listing-cart/schema/ListingCartDbSchema";
import type { ListingFlagDbSchema } from "../@session/listing-flag/schema/ListingFlagDbSchema";
import type { ListingIgnoreDbSchema } from "../@session/listing-ignore/schema/ListingIgnoreDbSchema";
import type { ListingScoreDbSchema } from "../@session/listing-score/schema/ListingScoreDbSchema";
import type { LocationDbSchema } from "../@session/location/schema/LocationDbSchema";
import type { UploadDbSchema } from "../@session/upload/schema/UploadDbSchema";
import type { UserExDbSchema } from "../@session/user-ex/schema/UserExDbSchema";
import type { auth } from "../auth/auth";

export interface Database {
	category: CategoryDbSchema.Type;
	category_miss: CategoryMissDbSchema.Type;
	category_spotlight: CategorySpotlightDbSchema.Type;
	feed: FeedDbSchema.Type;
	listing: ListingDbSchema.Type;
	listing_cart: ListingCartDbSchema.Type;
	listing_flag: ListingFlagDbSchema.Type;
	listing_ignore: ListingIgnoreDbSchema.Type;
	listing_score: ListingScoreDbSchema.Type;
	location: LocationDbSchema.Type;
	gallery: GalleryDbSchema.Type;
	upload: UploadDbSchema.Type;
	user: typeof auth.$Infer.Session.user;
	user_ex: UserExDbSchema.Type;
}
