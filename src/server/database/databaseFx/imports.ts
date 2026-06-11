import { importField } from "./importField";
import { importFieldOption } from "./importFieldOption";
import { importRateLimitRule } from "./importRateLimitRule";
import { importResourceBundle } from "./importResourceBundle";
import { importResourceBundleFeature } from "./importResourceBundleFeature";
import { importResourceBundleItem } from "./importResourceBundleItem";
import { importResourceBundleLimit } from "./importResourceBundleLimit";
import { importResourceDefinition } from "./importResourceDefinition";

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
