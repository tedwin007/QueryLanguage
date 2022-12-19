import jasmine from 'jasmine'
import { QlParser, parseInput } from './parser';
import { lexer } from "./lexer";

// TBD
describe('Parser', () => {
    let parser: QlParser;

    beforeEach(() => {
        parser = new QlParser();
    })

    it('should create QlParser instance', () => {
        expect(parser).toBeDefined();
    })

    describe("simple statement", () => {
        it('should parse a  successfully', () => {
            const statement = "(Asset fs > 10)";
            expect(parseInput(statement, lexer)).not.toThrowError();
        })

        it('should fail parsing numeric prop', () => {
            const statement = "(Asset 1 > 10)";
            expect(parseInput(statement, lexer)).toThrowError();
        })
    })

    describe("complex statement", () => {
        it('should parse an "And" statement successfully', () => {
            const statement = "(Asset fs > 10) And (Asset < 2)";
            expect(parseInput(statement, lexer)).not.toThrowError();
        })

        it('should parse an "and" statement successfully', () => {
            const statement = "(Asset fs > 10) and (Asset < 2)";
            expect(parseInput(statement, lexer)).not.toThrowError();
        })
    })
});

// 
