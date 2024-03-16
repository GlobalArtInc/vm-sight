import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

type Action = 'list' | 'create';

export class ExecContainersParams {
  action: Action;
}
