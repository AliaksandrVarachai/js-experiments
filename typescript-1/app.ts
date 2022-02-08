const greeting: string = 'Hello';

function f(greeting: string): string {
    console.log(greeting);
    return greeting;
}

const user = {
   birthDate: number = 42;
}

user.birthDate = '456';

f(greeting);