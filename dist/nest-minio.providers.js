"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function createNestMinioProviders(options) {
    return [
        {
            provide: constants_1.NEST_MINIO_OPTIONS,
            useValue: options,
        },
    ];
}
exports.createNestMinioProviders = createNestMinioProviders;
