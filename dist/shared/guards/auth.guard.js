"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
class AuthGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader)
                return false;
            const token = authHeader.split(" ")[1];
            const decoded = this.jwtService.verify(token);
            req.user = decoded;
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.AuthGuard = AuthGuard;
