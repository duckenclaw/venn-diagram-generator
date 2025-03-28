import * as d3 from 'd3';
import * as venn from 'venn.js';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import { LogicalExpressionEvaluator, VariableMap } from './evaluator';
import { ExpressionNode, extractVariables } from './parser';

export interface VennSet {
  sets: string[];
  size: number;
}

export class VennDiagramGenerator {
  private expressionTree: ExpressionNode;
  private evaluator: LogicalExpressionEvaluator;
  private variables: string[];

  constructor(expressionTree: ExpressionNode) {
    this.expressionTree = expressionTree;
    this.evaluator = new LogicalExpressionEvaluator(expressionTree);
    this.variables = Array.from(extractVariables(expressionTree));
  }

  public generateVennData(): VennSet[] {
    const vennData: VennSet[] = [];
    const truthTable = LogicalExpressionEvaluator.generateTruthTable(this.variables);
    
    // Add individual sets
    this.variables.forEach(variable => {
      vennData.push({
        sets: [variable],
        size: 1
      });
    });

    // Add intersections for all combinations
    for (let i = 0; i < this.variables.length; i++) {
      for (let j = i + 1; j < this.variables.length; j++) {
        vennData.push({
          sets: [this.variables[i], this.variables[j]],
          size: 0.5
        });
      }
    }

    // For 3-variable case, add the triple intersection
    if (this.variables.length >= 3) {
      for (let i = 0; i < this.variables.length - 2; i++) {
        for (let j = i + 1; j < this.variables.length - 1; j++) {
          for (let k = j + 1; k < this.variables.length; k++) {
            vennData.push({
              sets: [this.variables[i], this.variables[j], this.variables[k]],
              size: 0.25
            });
          }
        }
      }
    }
    
    // Calculate sets that satisfy the expression
    const expressionResult: VennSet = {
      sets: ['RESULT'],
      size: 1
    };
    vennData.push(expressionResult);

    // Add intersections between result and each variable set
    this.variables.forEach(variable => {
      const truthTableEntries = truthTable.filter(entry => {
        return entry.get(variable) && this.evaluator.evaluate(entry);
      });
      
      vennData.push({
        sets: ['RESULT', variable],
        size: truthTableEntries.length / truthTable.length
      });
    });

    return vennData;
  }

  public generateSVG(outputPath: string): void {
    // Create a JSDOM instance
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    const document = dom.window.document;
    
    // Create an SVG element
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '500');
    svgElement.setAttribute('height', '500');
    document.body.appendChild(svgElement);
    
    // Generate Venn diagram data
    const vennData = this.generateVennData();
    
    // Configure D3 and Venn.js for JSDOM
    // @ts-ignore - venn.js doesn't have proper TypeScript definitions
    const vennChart = venn.VennDiagram();
    const svg = d3.select(svgElement);
    
    // Draw the Venn diagram
    svg.datum(vennData).call(vennChart);
    
    // Style the diagram
    svg.selectAll('.venn-circle path')
      .style('fill-opacity', 0.3)
      .style('stroke', '#fff')
      .style('stroke-width', 3);

    svg.selectAll('.venn-circle text')
      .style('fill', 'black')
      .style('font-size', '16px')
      .style('font-weight', 'bold');
    
    // Get the SVG content
    const svgContent = svgElement.outerHTML;
    
    // Write to file
    fs.writeFileSync(outputPath, svgContent);
    
    console.log(`Venn diagram saved to ${outputPath}`);
  }
} 