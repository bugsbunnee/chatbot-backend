import { updateAndPollDocuments } from "../utils/schedule";

function registerSchedules() {
    updateAndPollDocuments();
}

export default registerSchedules;