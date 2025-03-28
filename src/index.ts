#!/usr/bin/env node

import { program } from 'commander';
import * as path from 'path';
import { LogicalExpressionParser } from './core/parser';
import { VennDiagramGenerator } from './core/venn-generator';

// Configure the command-line interface
program
  .version('1.0.0')
  .description('Generate a Venn diagram from a logical expression')
  .argument('<expression>', 'Logical expression (e.g., "A AND B", "A OR (B AND C)")')
  .option('-o, --output <path>', 'Output file path', 'venn-diagram.svg')
  .parse(process.argv);

const options = program.opts();
const expression = program.args[0];

// Process the logical expression
try {
  console.log(`Processing expression: ${expression}`);
  
  // Parse the expression
  const parser = new LogicalExpressionParser(expression);
  const expressionTree = parser.parse();
  
  // Generate the Venn diagram
  const generator = new VennDiagramGenerator(expressionTree);
  
  // Resolve the output path
  const outputPath = path.resolve(options.output);
  
  // Generate and save the SVG
  generator.generateSVG(outputPath);
  
} catch (error) {
  console.error('Error:', (error as Error).message);
  process.exit(1);
} 