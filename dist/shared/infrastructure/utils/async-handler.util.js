"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHandlerUtil = void 0;
const AsyncHandlerUtil = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.AsyncHandlerUtil = AsyncHandlerUtil;
