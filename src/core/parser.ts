export type LogicalOperator = 'AND' | 'OR' | 'NOT' | 'XOR';

export interface ExpressionNode {
  type: 'operator' | 'variable';
  value: string | LogicalOperator;
  left?: ExpressionNode;
  right?: ExpressionNode;
}

export class LogicalExpressionParser {
  private expression: string;
  private position: number = 0;

  constructor(expression: string) {
    // Normalize the expression: remove spaces and convert to uppercase
    this.expression = expression.replace(/\s+/g, '').toUpperCase();
  }

  public parse(): ExpressionNode {
    return this.parseExpression();
  }

  private parseExpression(): ExpressionNode {
    return this.parseOr();
  }

  private parseOr(): ExpressionNode {
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
      } else {
        break;
      }
    }

    return left;
  }

  private parseAnd(): ExpressionNode {
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
      } else {
        break;
      }
    }

    return left;
  }

  private parseXor(): ExpressionNode {
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
      } else {
        break;
      }
    }

    return left;
  }

  private parseNotOrAtom(): ExpressionNode {
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
        } else {
          throw new Error('Missing closing parenthesis');
        }
      }
    }
    
    return this.parseVariable();
  }

  private parseVariable(): ExpressionNode {
    let variableName = '';
    
    while (this.position < this.expression.length) {
      const char = this.expression[this.position];
      
      if (/[A-Z0-9]/.test(char)) {
        variableName += char;
        this.position++;
      } else {
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

// Helper function to extract unique variables from an expression tree
export function extractVariables(node: ExpressionNode): Set<string> {
  const variables = new Set<string>();
  
  function traverse(node: ExpressionNode) {
    if (node.type === 'variable') {
      variables.add(node.value as string);
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