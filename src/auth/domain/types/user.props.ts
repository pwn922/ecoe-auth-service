import { RoleProps } from "./role.props";


export interface UserProps {
    id: string | null;
    fullname: string | null;
    email: string;
    // password: string;
    role: RoleProps;
}
