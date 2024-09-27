"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platforms = exports.app_roles = exports.PLATFORM_LIMITS = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor'
};
exports.PLATFORM_LIMITS = {
    twitter: { charLimit: 280, imageAspect: '16:9' },
    instagram: { charLimit: 2200, imageAspect: '1:1' },
    facebook: { charLimit: 63206, imageAspect: '1.91:1' }
};
exports.app_roles = Object.values(exports.ROLES);
exports.platforms = Object.keys(exports.PLATFORM_LIMITS);
