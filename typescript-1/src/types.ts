type Admin = {
  name: string
  privileges: string[]
}

type Employee = {
  name: string
  startDate: Date
}

type ElevatedEmployee = Admin & Employee;

// declare function createElevatedEmployee(employee: ElevatedEmployee): ElevatedEmployee;

type User = Admin | Employee;

function createElevatedEmployee({ name, privileges, startDate }: ElevatedEmployee): ElevatedEmployee {
  return {
    name,
    privileges,
    startDate,
  };
}

// Generic Types

// declare function merge<T, U>(obj1: T, obj2: U): T & U;

function merge<T, U>(obj1: T, obj2: U): T & U {
  return {
    ...obj1,
    ...obj2
  }
}

const admin1: Admin = {
  name: 'admin1',
  privileges: ['read', 'write']
}

const employee1: Employee = {
  name: 'employee1',
  startDate: new Date('2020-01-01')
}

const merged = merge<Admin, Employee>(admin1, employee1);

function isAdmin(user: any): user is Admin {
  return typeof user?.name === 'string'
    && Array.isArray(user?.privileges)
    && user.privileges.every((p: unknown) => typeof p === 'string');
}

function isAdmin2(user: User): user is Admin {
  return Array.isArray((user as Admin).privileges) && (user as Admin).privileges.every((p: unknown) => typeof p === 'string');
}
