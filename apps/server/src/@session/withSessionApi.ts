import type { Routes } from "../hono/Routes";
import { withCategoryApi } from "./category/withCategoryApi";
import { withFeedApi } from "./feed/withFeedApi";
import { withGalleryApi } from "./gallery/withGalleryApi";
import { withListingApi } from "./listing/withListingApi";
import { withLocationApi } from "./location/withLocationApi";
import { withS3Api } from "./s3/withS3Api";
import { withUploadApi } from "./upload/withUploadApi";
import { withUserExApi } from "./user-ex/withUserExApi";

export const withSessionApi: Routes.Fn = (routes) => {
	routes.root.use("/api/session/*", async (c, next) => {
		const session = c.get("session");
		const user = c.get("user");
		if (!session || !user) {
			return c.json(
				{
					error: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	withCategoryApi(routes);
	withFeedApi(routes);
	withGalleryApi(routes);
	withListingApi(routes);
	withLocationApi(routes);
	withS3Api(routes);
	withUploadApi(routes);
	withUserExApi(routes);

	routes.root.route("/api/session", routes.sessionHono);
};
