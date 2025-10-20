import { z } from "zod";
import { GenerateClientTokenEventSchema } from "./GenerateClientTokenEventSchema";
import { UploadCompletedEventSchema } from "./UploadCompletedEventSchema";

export const HandleUploadBodySchema = z
	.union([
		GenerateClientTokenEventSchema,
		UploadCompletedEventSchema,
	])
	.openapi("HandleUploadBody");
