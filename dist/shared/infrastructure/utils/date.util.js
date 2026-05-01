"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
const ms_1 = __importDefault(require("ms"));
class DateUtil {
    static addTimeToCurrentDate(timeString) {
        const milliseconds = (0, ms_1.default)(timeString);
        if (milliseconds === undefined) {
            throw new Error(`[DateUtil] Formato de tiempo inválido: ${timeString}`);
        }
        return new Date(Date.now() + milliseconds);
    }
}
exports.DateUtil = DateUtil;
