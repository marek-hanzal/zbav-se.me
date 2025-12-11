import { withTransactionStatusApi } from "~/@user/transaction-status/withTransactionStatusApi";
import type { WithDatabase } from "~/database/WithDatabase";
import type { Routes } from "~/hono/Routes";
import type { MessageSchema } from "~/schema/MessageSchema";
import { withFavouriteApi } from "./favourite/withFavouriteApi";
import { withFavouriteFeedApi } from "./favourite-feed/withFavouriteFeedApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withFlagApi } from "./flag/withFlagApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withIgnoreApi } from "./ignore/withIgnoreApi";
import { withListingApi } from "./listing/withListingApi";
import { withListingScoreApi } from "./listing-score/withListingScoreApi";
import { withMessageTextApi } from "./message-text/withMessageTextApi";
import { withS3Api } from "./s3/withS3Api";
import { withTransactionApi } from "./transaction/withTransactionApi";
import { withTransactionGalleryApi } from "./transaction-gallery/withTransactionGalleryApi";
import { withTransactionLogApi } from "./transaction-log/withTransactionLogApi";
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

	withFavouriteApi(routes);
	withFavouriteFeedApi(routes);
	withFeedApi(routes);
	withGalleryApi(routes);
	withIgnoreApi(routes);
	withListingApi(routes);
	withFlagApi(routes);
	withListingScoreApi(routes);
	withTransactionApi(routes);
	withTransactionGalleryApi(routes);
	withTransactionLogApi(routes);
	withMessageTextApi(routes);
	withTransactionStatusApi(routes);
	withS3Api(routes);
	withUploadApi(routes);
	withUserExApi(routes);

	routes.root.route("/api/user", routes.userHono);
};
