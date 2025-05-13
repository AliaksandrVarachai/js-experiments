import type { IsString, Optional } from './type-manipulations';

const str = 'string';
const num = 21;

const True: IsString<typeof str> = true;
const False: IsString<typeof num> = false;

type Person = {
  name: string;
  age: number;
  email: string;
}

type OptionalPerson = Optional<Person>;

const optionalPerson: OptionalPerson = {
  email: 'test@test.com'
};

type LightPerson = Pick<Person, 'name' | 'email'>

const lightPerson: LightPerson = {
  name: 'John',
  email: 'no@email.com'
}

