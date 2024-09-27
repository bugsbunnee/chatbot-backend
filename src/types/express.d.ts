import { AuthUser } from "@/models/user/schema";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser; // Add user to the Request interface
        }
    }
}