import { importField } from "~/database/constant/importField";
import { importFieldOption } from "~/database/constant/importFieldOption";
import { importRateLimitRule } from "~/database/constant/importRateLimitRule";
import { importResourceBundle } from "~/database/constant/importResourceBundle";
import { importResourceBundleFeature } from "~/database/constant/importResourceBundleFeature";
import { importResourceBundleItem } from "~/database/constant/importResourceBundleItem";
import { importResourceBundleLimit } from "~/database/constant/importResourceBundleLimit";
import { importResourceDefinition } from "~/database/constant/importResourceDefinition";

export const imports = [
	importField,
	importFieldOption,
	importRateLimitRule,
	importResourceDefinition,
	importResourceBundle,
	importResourceBundleLimit,
	importResourceBundleItem,
	importResourceBundleFeature,
];
