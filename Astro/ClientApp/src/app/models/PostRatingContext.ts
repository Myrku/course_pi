import { ActionResultStatus } from "./Statuses/ActionResultStatus";

export class PostRatingContext {
    status: ActionResultStatus;
    curUserRating: number;
    generalRating: number;
}