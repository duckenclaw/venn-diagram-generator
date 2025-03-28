import { ExpressionNode, LogicalOperator } from './parser';

export type VariableMap = Map<string, boolean>;

export class LogicalExpressionEvaluator {
  private expressionTree: ExpressionNode;

  constructor(expressionTree: ExpressionNode) {
    this.expressionTree = expressionTree;
  }

  public evaluate(variables: VariableMap): boolean {
    return this.evaluateNode(this.expressionTree, variables);
  }

  private evaluateNode(node: ExpressionNode, variables: VariableMap): boolean {
    if (node.type === 'variable') {
      const variableName = node.value as string;
      if (!variables.has(variableName)) {
        throw new Error(`Variable ${variableName} is not defined`);
      }
      return variables.get(variableName)!;
    }

    const operator = node.value as LogicalOperator;

    switch (operator) {
      case 'AND':
        return this.evaluateNode(node.left!, variables) && this.evaluateNode(node.right!, variables);
      
      case 'OR':
        return this.evaluateNode(node.left!, variables) || this.evaluateNode(node.right!, variables);
      
      case 'XOR':
        return this.evaluateNode(node.left!, variables) !== this.evaluateNode(node.right!, variables);
      
      case 'NOT':
        return !this.evaluateNode(node.left!, variables);
      
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  /**
   * Generate all possible combinations of variable values
   */
  public static generateTruthTable(variables: string[]): VariableMap[] {
    const combinations: VariableMap[] = [];
    const totalCombinations = Math.pow(2, variables.length);

    for (let i = 0; i < totalCombinations; i++) {
      const variableMap = new Map<string, boolean>();
      
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