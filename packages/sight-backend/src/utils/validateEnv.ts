import { cleanEnv, port, str } from 'envalid';

export default function () {
  cleanEnv(process.env, {
    API: str(),
    DATA_DIR: str(),
    PORT: port(),
  });
}
