import { publishPendingPostsJob } from "../utils/schedule";

function registerSchedules() {
    publishPendingPostsJob();
}

export default registerSchedules;