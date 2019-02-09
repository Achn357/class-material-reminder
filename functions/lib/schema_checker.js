"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class schemaChecker {
    constructor(json) {
        this.schema = json;
    }
    getSchema() {
        return this.schema;
    }
    compare_schema(checking_needed_json) {
        const missing_keys_json = this.getSchema();
        for (const key in checking_needed_json) {
            if (missing_keys_json.hasOwnProperty(key)) {
                delete missing_keys_json[key];
            }
        }
        const missing_keys = [];
        for (const key in missing_keys_json) {
            missing_keys.push(key);
        }
        return missing_keys;
    }
}
exports.schemaChecker = schemaChecker;
//# sourceMappingURL=schema_checker.js.map