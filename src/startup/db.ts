import mongoose from "mongoose";
import logger from "./logger";

function registerDB() {
    mongoose.connect(process.env.DB_URL as string)
    .then(() => logger.info(`Connected to DB: ${process.env.DB_URL}`))
    .catch((error) => logger.error(error));
}

export default registerDB;