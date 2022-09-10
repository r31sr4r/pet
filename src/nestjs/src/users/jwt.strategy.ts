import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SearchParams } from 'pet-core/@seedwork/domain';
import { ListUsersUseCase } from 'pet-core/user/application';
import { JwtPayload } from './dto/jwt-payload.interface';
import { SearchUserDto } from './dto/search-user.dto'
import { UserPresenter } from './presenter/user.presenter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "secretKey987123",
        });
    }
    @Inject(ListUsersUseCase.UseCase)
    private listUseCase: ListUsersUseCase.UseCase;

    async validate(payload: JwtPayload) {
        const { email } = payload;
        const searchParams: SearchUserDto = new SearchParams({
            filter: email,
        });
        
        const user = await this.listUseCase.execute(searchParams);

        if (user.items.length === 0) {
            throw new UnauthorizedException();
        }
        else {           
            return new UserPresenter(user.items[0]);
        }
    }
}