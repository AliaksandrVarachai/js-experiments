export type IsString<T> = T extends string ? true : false;

// = Partial utility type
export type Optional<T> = {
  [P in keyof T]?: T[P];
}

export type User = {
  name: string;
  age: number;
}

export type OptionalUser = Optional<User>;

type UserWithNameOnly = Pick<User, 'name'>;

