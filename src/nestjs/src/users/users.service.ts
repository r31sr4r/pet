import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class UsersService {
    constructor(private jwtService: JwtService) {}

    async signIn(user: JwtPayload): Promise<{ accessToken: string }> {
        const payload = { user };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
        };
    }
}
