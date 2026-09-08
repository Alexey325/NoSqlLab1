import {JwtPayload} from "./jwt-payload.type";

export interface UserRequestType extends Request {
    user: JwtPayload;
}