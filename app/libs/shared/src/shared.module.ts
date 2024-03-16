import { ConfigService } from '@nestjs/config';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity, UserRepository } from '@app/dal/repositories';
import { RoleEntity, RoleRepository } from '@app/dal/repositories/role';
import { SessionEntity } from '@app/dal/repositories/session/session.entity';
import { SessionRepository } from '@app/dal/repositories/session';
import { AuthCookieStrategy } from 'apps/api/src/auth/guards/strategies/auth-cookie.strategy';
import { AuthService } from 'apps/api/src/auth/auth.service';
import { AuthTokenStrategy } from 'apps/api/src/auth/guards/strategies/auth-token.strategy';
import { EndpointEntity, EndpointRepository } from '@app/dal/repositories/endpoint';

const DAL_MODELS = [UserRepository, SessionRepository, RoleRepository, EndpointRepository];
const DAL_ENTITIES = [UserEntity, SessionEntity, RoleEntity, EndpointEntity];

const authStrategies = [
  {
    provide: AuthCookieStrategy,
    useClass: AuthCookieStrategy,
  },
  {
    provide: AuthTokenStrategy,
    useClass: AuthTokenStrategy,
  },
];

const DAL_PROVIDERS = [AuthService, ...authStrategies];

@Module({
  imports: [TypeOrmModule.forFeature([...DAL_ENTITIES]), HttpModule],
  providers: [...DAL_MODELS, ...DAL_PROVIDERS, ConfigService],
  exports: [TypeOrmModule.forFeature([...DAL_ENTITIES]), ...DAL_PROVIDERS, ...DAL_MODELS, ConfigService],
})
export class SharedModule {}
