export interface IUser {
    id: string;
    telegram_id: string | null;
    max_id: string | null;
    first_name: string;
    second_name: string | null;
    login: string | null;
}