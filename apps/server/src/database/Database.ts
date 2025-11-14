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
import type { ListingTransactionDbSchema } from "../app/listing-transaction/schema/ListingTransactionDbSchema";
import type { ListingTransactionLogDbSchema } from "../app/listing-transaction-log/schema/ListingTransactionLogDbSchema";
import type { LocationDbSchema } from "../app/location/schema/LocationDbSchema";
import type { UploadDbSchema } from "../app/upload/schema/UploadDbSchema";
import type { UserExDbSchema } from "../app/user-ex/schema/UserExDbSchema";
import type { auth } from "../auth/auth";

export interface Database {
	category_miss: CategoryMissDbSchema.Type;
	category_spotlight: CategorySpotlightDbSchema.Type;
	category: CategoryDbSchema.Type;
	feed: FeedDbSchema.Type;
	gallery: GalleryDbSchema.Type;
	listing_cart: ListingCartDbSchema.Type;
	listing_flag: ListingFlagDbSchema.Type;
	listing_ignore: ListingIgnoreDbSchema.Type;
	listing_score: ListingScoreDbSchema.Type;
	listing_transaction_log: ListingTransactionLogDbSchema.Type;
	listing_transaction: ListingTransactionDbSchema.Type;
	listing: ListingDbSchema.Type;
	location: LocationDbSchema.Type;
	upload: UploadDbSchema.Type;
	user_ex: UserExDbSchema.Type;
	user: typeof auth.$Infer.Session.user;
}
