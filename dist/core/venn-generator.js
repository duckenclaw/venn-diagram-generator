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
exports.VennDiagramGenerator = void 0;
const d3 = __importStar(require("d3"));
const venn = __importStar(require("venn.js"));
const jsdom_1 = require("jsdom");
const fs = __importStar(require("fs"));
const evaluator_1 = require("./evaluator");
const parser_1 = require("./parser");
class VennDiagramGenerator {
    constructor(expressionTree) {
        this.expressionTree = expressionTree;
        this.evaluator = new evaluator_1.LogicalExpressionEvaluator(expressionTree);
        this.variables = Array.from((0, parser_1.extractVariables)(expressionTree));
    }
    generateVennData() {
        const vennData = [];
        const truthTable = evaluator_1.LogicalExpressionEvaluator.generateTruthTable(this.variables);
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
        const expressionResult = {
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
    generateSVG(outputPath) {
        // Create a JSDOM instance
        const dom = new jsdom_1.JSDOM(`<!DOCTYPE html><html><body></body></html>`);
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
exports.VennDiagramGenerator = VennDiagramGenerator;
//# sourceMappingURL=venn-generator.js.map