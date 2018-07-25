import * as auth from 'basic-auth';
import { Request } from 'restify';

export function isValid(req: Request) {
    var a : auth.BasicAuthResult = auth.parse(req.header("Authorization"));
    if(!a) return;
    return a.name == process.env.auth_username && a.pass == process.env.auth_password;
}