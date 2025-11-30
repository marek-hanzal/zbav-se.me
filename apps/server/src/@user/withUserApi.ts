import { withListingTransactionStatusApi } from "~/@user/listing-transaction-status/withListingTransactionStatusApi";
import type { WithDatabase } from "~/database/WithDatabase";
import type { Routes } from "~/hono/Routes";
import type { MessageSchema } from "~/schema/MessageSchema";
import { withCategoryCartApi } from "./category-cart/withCategoryCartApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withListingApi } from "./listing/withListingApi";
import { withListingCartApi } from "./listing-cart/withListingCartApi";
import { withListingFlagApi } from "./listing-flag/withListingFlagApi";
import { withListingIgnoreApi } from "./listing-ignore/withListingIgnoreApi";
import { withListingScoreApi } from "./listing-score/withListingScoreApi";
import { withListingTransactionApi } from "./listing-transaction/withListingTransactionApi";
import { withListingTransactionGalleryApi } from "./listing-transaction-gallery/withListingTransactionGalleryApi";
import { withListingTransactionLogApi } from "./listing-transaction-log/withListingTransactionLogApi";
import { withListingTransactionMessageApi } from "./listing-transaction-message/withListingTransactionMessageApi";
import { withS3Api } from "./s3/withS3Api";
import { withUploadApi } from "./upload/withUploadApi";
import { withUserExApi } from "./user-ex/withUserExApi";

export const withUserApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = (routes, deps) => {
	routes.userHono.use(async (c, next) => {
		c.set("database", deps.database);
		return next();
	});

	routes.root.use("/api/user/*", async (c, next) => {
		const user = c.get("user");
		if (!user) {
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

	withCategoryCartApi(routes);
	withFeedApi(routes);
	withGalleryApi(routes);
	withListingApi(routes);
	withListingCartApi(routes);
	withListingFlagApi(routes);
	withListingIgnoreApi(routes);
	withListingScoreApi(routes);
	withListingTransactionApi(routes);
	withListingTransactionGalleryApi(routes);
	withListingTransactionLogApi(routes);
	withListingTransactionMessageApi(routes);
	withListingTransactionStatusApi(routes);
	withS3Api(routes);
	withUploadApi(routes);
	withUserExApi(routes);

	routes.root.route("/api/user", routes.userHono);
};
