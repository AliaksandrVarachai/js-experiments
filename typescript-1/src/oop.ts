// Inheritance
class Person {
  firstName: string;
  lastName: string;
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  getFullName = () => `${this.firstName} ${this.lastName}`;
}

class Student extends Person {
  grade: number;
  constructor(firstName: string, lastName: string, grade: number) {
    super(firstName, lastName);
    this.grade = grade;
  }
  getStudentInfo = () => `${this.getFullName()}: ${this.grade}`;
}

const person = new Person('Alex', 'Smith');
const student = new Student('Mike', 'Jordan', 98);
console.group('OOP');
console.log(`Person's full name: ${person.getFullName()}`);
console.log(`Student's info: ${student.getStudentInfo()}`);
console.groupEnd();

// Polymorphism
interface IPerson {
  firstName: string;
  lastName: string;
  getFullName: () => string;
}

class Person2 implements IPerson {
  firstName: string;
  lastName: string;
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  getFullName = () => `${this.firstName} ${this.lastName}`;
}

class Student2 implements  IPerson {
  firstName: string;
  lastName: string;
  grade: number;
  constructor(firstName: string, lastName: string, grade: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.grade = grade;
  }
  getFullName = () => `${this.firstName} ${this.lastName}`;
  getStudentInfo = () => `${this.getFullName()}: ${this.grade}`;
}

const person2 = new Person2('Matthew', 'McDonald');
const student2 = new Student2('Patrick', 'Jonson', 77);

console.group('Polymorphism');
console.log(`Person's full name: ${person2.getFullName()}`);
console.log(`Student's info: ${student2.getStudentInfo()}`);
console.groupEnd();
