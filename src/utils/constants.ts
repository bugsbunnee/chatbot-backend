export enum FileType {
    PDF = 'pdf',
    TXT = 'txt'
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
};

export const PLATFORM_LIMITS = {
    twitter: { charLimit: 280, imageAspect: '16:9' },
    instagram: { charLimit: 2200, imageAspect: '1:1' },
    facebook: { charLimit: 63206, imageAspect: '1.91:1' }
};

export const FILE_TYPES = [
    FileType.PDF,
    FileType.TXT
];

export const APP_ROLES = [
    Role.ADMIN,
    Role.USER
];

export const MAX_CONTENT_LENGTH = 236000;
export const PLATFORMS = Object.keys(PLATFORM_LIMITS);