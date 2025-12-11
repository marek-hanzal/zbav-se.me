import { withTransactionStatusApi } from "~/@user/transaction-status/withTransactionStatusApi";
import { withFeedFavouriteApi } from "~/app/feed-favourite/withFeedFavouriteApi";
import type { WithDatabase } from "~/database/WithDatabase";
import type { Routes } from "~/hono/Routes";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withFavouriteApi } from "./favourite/withFavouriteApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withFlagApi } from "./flag/withFlagApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withIgnoreApi } from "./ignore/withIgnoreApi";
import { withListingApi } from "./listing/withListingApi";
import { withListingScoreApi } from "./listing-score/withListingScoreApi";
import { withMessageTextApi } from "./message-text/withMessageTextApi";
import { withS3Api } from "./s3/withS3Api";
import { withTransactionApi } from "./transaction/withTransactionApi";
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
			return c.json<NoticeSchema.Type, 401>(
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
	withFeedApi(routes);
	withFeedFavouriteApi(routes);
	withFlagApi(routes);
	withGalleryApi(routes);
	withIgnoreApi(routes);
	withListingApi(routes);
	withListingScoreApi(routes);
	withMessageTextApi(routes);
	withS3Api(routes);
	withTransactionApi(routes);
	withTransactionStatusApi(routes);
	withUploadApi(routes);
	withUserExApi(routes);

	routes.root.route("/api/user", routes.userHono);
};
