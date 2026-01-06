import { withTransactionStatusApi } from "~/@user/transaction-status/withTransactionStatusApi";
import type { WithDatabase } from "~/database/WithDatabase";
import type { Routes } from "~/hono/Routes";
import type { NoticeSchema } from "~/schema/NoticeSchema";
import { withDraftApi } from "./draft/withDraftApi";
import { withFavouriteApi } from "./favourite/withFavouriteApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withFeedFavouriteApi } from "./feed-favourite/withFeedFavouriteApi";
import { withFeedbackApi } from "./feedback/withFeedbackApi";
import { withFlagApi } from "./flag/withFlagApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withIgnoreApi } from "./ignore/withIgnoreApi";
import { withListingApi } from "./listing/withListingApi";
import { withListingEventApi } from "./listing-event/withListingEventApi";
import { withMessageThreadApi } from "./message-thread/withMessageThreadApi";
import { withS3Api } from "./s3/withS3Api";
import { withTransactionApi } from "./transaction/withTransactionApi";
import { withTransactionMessageGalleryApi } from "./transaction-message-gallery/withTransactionMessageGalleryApi";
import { withTransactionMessageLocationApi } from "./transaction-message-location/withTransactionMessageLocationApi";
import { withTransactionMessagePackageApi } from "./transaction-message-package/withTransactionMessagePackageApi";
import { withTransactionMessagePersonalApi } from "./transaction-message-personal/withTransactionMessagePersonalApi";
import { withTransactionMessageTextApi } from "./transaction-message-text/withTransactionMessageTextApi";
import { withUploadApi } from "./upload/withUploadApi";
import { withUserEventApi } from "./user-event/withUserEventApi";
import { withUserExApi } from "./user-ex/withUserExApi";

export const withUserApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = async (routes, deps) => {
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

	await withDraftApi(routes);
	await withFavouriteApi(routes);
	await withFeedApi(routes);
	await withFeedbackApi(routes);
	await withFeedFavouriteApi(routes);
	await withFlagApi(routes);
	await withGalleryApi(routes);
	await withIgnoreApi(routes);
	await withListingApi(routes);
	await withListingEventApi(routes);
	await withMessageThreadApi(routes);
	await withS3Api(routes);
	await withTransactionApi(routes);
	await withTransactionMessageGalleryApi(routes);
	await withTransactionMessageLocationApi(routes);
	await withTransactionMessagePackageApi(routes);
	await withTransactionMessagePersonalApi(routes);
	await withTransactionMessageTextApi(routes);
	await withTransactionStatusApi(routes);
	await withUploadApi(routes);
	await withUserEventApi(routes);
	await withUserExApi(routes);

	routes.root.route("/api/user", routes.userHono);
};
