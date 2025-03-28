"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalExpressionEvaluator = void 0;
class LogicalExpressionEvaluator {
    constructor(expressionTree) {
        this.expressionTree = expressionTree;
    }
    evaluate(variables) {
        return this.evaluateNode(this.expressionTree, variables);
    }
    evaluateNode(node, variables) {
        if (node.type === 'variable') {
            const variableName = node.value;
            if (!variables.has(variableName)) {
                throw new Error(`Variable ${variableName} is not defined`);
            }
            return variables.get(variableName);
        }
        const operator = node.value;
        switch (operator) {
            case 'AND':
                return this.evaluateNode(node.left, variables) && this.evaluateNode(node.right, variables);
            case 'OR':
                return this.evaluateNode(node.left, variables) || this.evaluateNode(node.right, variables);
            case 'XOR':
                return this.evaluateNode(node.left, variables) !== this.evaluateNode(node.right, variables);
            case 'NOT':
                return !this.evaluateNode(node.left, variables);
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }
    /**
     * Generate all possible combinations of variable values
     */
    static generateTruthTable(variables) {
        const combinations = [];
        const totalCombinations = Math.pow(2, variables.length);
        for (let i = 0; i < totalCombinations; i++) {
            const variableMap = new Map();
            for (let j = 0; j < variables.length; j++) {
                // Determine if the current bit is set
                const isSet = (i & (1 << j)) !== 0;
                variableMap.set(variables[j], isSet);
            }
            combinations.push(variableMap);
        }
        return combinations;
    }
}
exports.LogicalExpressionEvaluator = LogicalExpressionEvaluator;
//# sourceMappingURL=evaluator.js.map