// This is the representation of the data structures in the app.

export abstract class Comp {
    name: string;
    component: any;
    data: any;
}

export class Question {
    components: Comp[];
    title: string;
}

export class Brick {
    title: string;
    brief: string;
    prep: string;
    subject: string;
    type: number;
    pallet: Pallet;
    creator: string;
    creationDate: Date;
    highScore: number;
    avgScore: number;
    totalUsers: number;
    questions: Question[];
}

export class Pallet {
    name: string;
    bricks: Brick[];
}

export class ComponentAttempt {
    answer: any;
    correct: boolean;
}

export class QuestionAttempt {
    question: Question;
    components: ComponentAttempt[];
}

export class BrickAttempt {
    brick: Brick;
    score: number;
    student: Student;
    answers: QuestionAttempt[];
}

export class StudentPallet {
    pallet: Pallet;
    student: Student;
    teacher: Teacher;
    bricks: BrickAttempt[];
}

export class Student {
    uid: string;
    name: string;
    pallets: StudentPallet[];
}

export class Class {
    teacher: Teacher;
    students: Student[];
    pallets: Pallet[];
}

export class Teacher {
    uid: string;
    name: string;
    classes: Class[];
}