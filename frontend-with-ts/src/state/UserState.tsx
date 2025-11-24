import { useThis } from "react-usethis";

export const UserState = new useThis<{
    user_data?:{ id: number; name: string; email: string; role: string } | null;
}>({}).create()