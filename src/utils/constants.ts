export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor'
};

export const PLATFORM_LIMITS = {
    twitter: { charLimit: 280, imageAspect: '16:9' },
    instagram: { charLimit: 2200, imageAspect: '1:1' },
    facebook: { charLimit: 63206, imageAspect: '1.91:1' }
};

export const app_roles = Object.values(ROLES);
export const platforms = Object.keys(PLATFORM_LIMITS);