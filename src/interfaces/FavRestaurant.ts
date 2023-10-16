import { User } from "./User";

interface addFavoriteRestaurant {
    message: string;
    data: {
        favouriteRestaurant: string;
        user: User;
    }
}

export type {addFavoriteRestaurant}

