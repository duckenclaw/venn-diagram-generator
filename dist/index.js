#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const parser_1 = require("./core/parser");
const venn_generator_1 = require("./core/venn-generator");
// Configure the command-line interface
commander_1.program
    .version('1.0.0')
    .description('Generate a Venn diagram from a logical expression')
    .argument('<expression>', 'Logical expression (e.g., "A AND B", "A OR (B AND C)")')
    .option('-o, --output <path>', 'Output file path', 'venn-diagram.svg')
    .parse(process.argv);
const options = commander_1.program.opts();
const expression = commander_1.program.args[0];
// Process the logical expression
try {
    console.log(`Processing expression: ${expression}`);
    // Parse the expression
    const parser = new parser_1.LogicalExpressionParser(expression);
    const expressionTree = parser.parse();
    // Generate the Venn diagram
    const generator = new venn_generator_1.VennDiagramGenerator(expressionTree);
    // Resolve the output path
    const outputPath = path.resolve(options.output);
    // Generate and save the SVG
    generator.generateSVG(outputPath);
}
catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
//# sourceMappingURL=index.js.map