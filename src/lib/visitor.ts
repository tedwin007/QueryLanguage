import { parser } from "./parser";

const baseVisitor = parser.getBaseCstVisitorConstructorWithDefaults()

export class Visitor extends baseVisitor {
    constructor() {
        super();
        this.validateVisitor()
    }
}

export const visitor = new Visitor();