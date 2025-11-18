import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import type { MessageSchema } from "../schema/MessageSchema";
import { withCategoryApi } from "./category/withCategoryApi";
import { withCategoryCartApi } from "./category-cart/withCategoryCartApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withListingApi } from "./listing/withListingApi";
import { withListingCartApi } from "./listing-cart/withListingCartApi";
import { withListingFlagApi } from "./listing-flag/withListingFlagApi";
import { withListingIgnoreApi } from "./listing-ignore/withListingIgnoreApi";
import { withListingScoreApi } from "./listing-score/withListingScoreApi";
import { withListingTransactionApi } from "./listing-transaction/withListingTransactionApi";
import { withListingTransactionLogApi } from "./listing-transaction-log/withListingTransactionLogApi";
import { withLocationApi } from "./location/withLocationApi";
import { withS3Api } from "./s3/withS3Api";
import { withUploadApi } from "./upload/withUploadApi";
import { withUserExApi } from "./user-ex/withUserExApi";

export const withSessionApi: Routes.Fn = (routes) => {
	routes.sessionHono.use(async (c, next) => {
		c.set("database", database.kysely);
		return next();
	});

	routes.root.use("/api/session/*", async (c, next) => {
		const session = c.get("session");
		const user = c.get("user");
		if (!session || !user) {
			return c.json<MessageSchema.Type, 401>(
				{
					type: "error",
					message: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	withCategoryApi(routes);
	withCategoryCartApi(routes);
	withFeedApi(routes);
	withGalleryApi(routes);
	withListingApi(routes);
	withListingCartApi(routes);
	withListingIgnoreApi(routes);
	withListingFlagApi(routes);
	withListingTransactionApi(routes);
	withListingTransactionLogApi(routes);
	withListingScoreApi(routes);
	withLocationApi(routes);
	withS3Api(routes);
	withUploadApi(routes);
	withUserExApi(routes);

	routes.root.route("/api/session", routes.sessionHono);
};
