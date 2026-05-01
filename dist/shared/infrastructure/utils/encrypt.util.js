"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptUtil = void 0;
const crypto_js_1 = require("crypto-js");
const aes_1 = require("crypto-js/aes");
const uft8 = __importStar(require("crypto-js/enc-utf8"));
const logger_util_1 = require("./logger.util");
var EncryptUtil;
(function (EncryptUtil) {
    function encryptBase64(data, plainKey) {
        try {
            const iv = uft8.parse(plainKey.substring(0, 16));
            const key = uft8.parse(plainKey.substring(16));
            return (0, aes_1.encrypt)(data, key, {
                iv,
                mode: crypto_js_1.mode.CBC,
                padding: crypto_js_1.pad.Pkcs7,
            }).toString();
        }
        catch (error) {
            logger_util_1.logger.error("Error en encrypt", error);
            return null;
        }
    }
    EncryptUtil.encryptBase64 = encryptBase64;
    function decryptBase64(data, plainKey) {
        try {
            const iv = uft8.parse(plainKey.substring(0, 16));
            const key = uft8.parse(plainKey.substring(16));
            return (0, aes_1.decrypt)(data, key, {
                iv,
                mode: crypto_js_1.mode.CBC,
                padding: crypto_js_1.pad.Pkcs7,
            }).toString(uft8);
        }
        catch (error) {
            logger_util_1.logger.error("Error en decrypt", error);
            return null;
        }
    }
    EncryptUtil.decryptBase64 = decryptBase64;
})(EncryptUtil || (exports.EncryptUtil = EncryptUtil = {}));
