import {Role} from "../../roles/model/role.model";

export type JwtPayload = {
    id: number,
    username: string,
    roles: Role[]
}
