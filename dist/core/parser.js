"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalExpressionParser = void 0;
exports.extractVariables = extractVariables;
class LogicalExpressionParser {
    constructor(expression) {
        this.position = 0;
        // Normalize the expression: remove spaces and convert to uppercase
        this.expression = expression.replace(/\s+/g, '').toUpperCase();
    }
    parse() {
        return this.parseExpression();
    }
    parseExpression() {
        return this.parseOr();
    }
    parseOr() {
        let left = this.parseAnd();
        while (this.position < this.expression.length) {
            const current = this.expression.substring(this.position);
            if (current.startsWith('OR') || current.startsWith('||') || current.startsWith('+')) {
                // Skip the operator
                this.position += current.startsWith('OR') ? 2 : (current.startsWith('||') ? 2 : 1);
                const right = this.parseAnd();
                left = {
                    type: 'operator',
                    value: 'OR',
                    left,
                    right
                };
            }
            else {
                break;
            }
        }
        return left;
    }
    parseAnd() {
        let left = this.parseXor();
        while (this.position < this.expression.length) {
            const current = this.expression.substring(this.position);
            if (current.startsWith('AND') || current.startsWith('&&') || current.startsWith('*')) {
                // Skip the operator
                this.position += current.startsWith('AND') ? 3 : (current.startsWith('&&') ? 2 : 1);
                const right = this.parseXor();
                left = {
                    type: 'operator',
                    value: 'AND',
                    left,
                    right
                };
            }
            else {
                break;
            }
        }
        return left;
    }
    parseXor() {
        let left = this.parseNotOrAtom();
        while (this.position < this.expression.length) {
            const current = this.expression.substring(this.position);
            if (current.startsWith('XOR') || current.startsWith('^')) {
                // Skip the operator
                this.position += current.startsWith('XOR') ? 3 : 1;
                const right = this.parseNotOrAtom();
                left = {
                    type: 'operator',
                    value: 'XOR',
                    left,
                    right
                };
            }
            else {
                break;
            }
        }
        return left;
    }
    parseNotOrAtom() {
        if (this.position < this.expression.length) {
            const current = this.expression.substring(this.position);
            if (current.startsWith('NOT') || current.startsWith('!')) {
                // Skip the operator
                this.position += current.startsWith('NOT') ? 3 : 1;
                const operand = this.parseNotOrAtom();
                return {
                    type: 'operator',
                    value: 'NOT',
                    left: operand
                };
            }
            if (current.startsWith('(')) {
                // Skip the opening parenthesis
                this.position++;
                const expression = this.parseExpression();
                // Expect a closing parenthesis
                if (this.position < this.expression.length && this.expression[this.position] === ')') {
                    this.position++;
                    return expression;
                }
                else {
                    throw new Error('Missing closing parenthesis');
                }
            }
        }
        return this.parseVariable();
    }
    parseVariable() {
        let variableName = '';
        while (this.position < this.expression.length) {
            const char = this.expression[this.position];
            if (/[A-Z0-9]/.test(char)) {
                variableName += char;
                this.position++;
            }
            else {
                break;
            }
        }
        if (variableName.length === 0) {
            throw new Error(`Expected variable name at position ${this.position}`);
        }
        return {
            type: 'variable',
            value: variableName
        };
    }
}
exports.LogicalExpressionParser = LogicalExpressionParser;
// Helper function to extract unique variables from an expression tree
function extractVariables(node) {
    const variables = new Set();
    function traverse(node) {
        if (node.type === 'variable') {
            variables.add(node.value);
        }
        if (node.left) {
            traverse(node.left);
        }
        if (node.right) {
            traverse(node.right);
        }
    }
    traverse(node);
    return variables;
}
//# sourceMappingURL=parser.js.map