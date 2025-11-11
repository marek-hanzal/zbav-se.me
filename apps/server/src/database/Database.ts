import type { CategoryDbSchema } from "../app/category/schema/CategoryDbSchema";
import type { CategorySpotlightDbSchema } from "../app/category/schema/CategorySpotlightDbSchema";
import type { CategoryMissDbSchema } from "../app/category-miss/schema/CategoryMissDbSchema";
import type { FeedDbSchema } from "../app/feed/schema/FeedDbSchema";
import type { GalleryDbSchema } from "../app/gallery/schema/GalleryDbSchema";
import type { ListingDbSchema } from "../app/listing/schema/ListingDbSchema";
import type { ListingCartDbSchema } from "../app/listing-cart/schema/ListingCartDbSchema";
import type { ListingFlagDbSchema } from "../app/listing-flag/schema/ListingFlagDbSchema";
import type { ListingIgnoreDbSchema } from "../app/listing-ignore/schema/ListingIgnoreDbSchema";
import type { ListingScoreDbSchema } from "../app/listing-score/schema/ListingScoreDbSchema";
import type { LocationDbSchema } from "../app/location/schema/LocationDbSchema";
import type { UploadDbSchema } from "../app/upload/schema/UploadDbSchema";
import type { UserExDbSchema } from "../app/user-ex/schema/UserExDbSchema";
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
