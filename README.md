# Venn Diagram Generator

A TypeScript command-line application that generates Venn diagrams from logical expressions.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/venn-diagram-generator.git
cd venn-diagram-generator

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

Run the application with a logical expression:

```bash
npm start -- "A AND B"
```

Or directly:

```bash
node dist/index.js "A AND (B OR C)"
```

### Options

- `-o, --output <path>`: Specify the output file path (default: `venn-diagram.svg`)

### Supported Operators

- `AND`, `&&`, `*`: Logical AND
- `OR`, `||`, `+`: Logical OR
- `XOR`, `^`: Exclusive OR
- `NOT`, `!`: Logical NOT
- Parentheses for grouping expressions

### Examples

```bash
# Generate a Venn diagram for "A AND B"
npm start -- "A AND B"

# Generate a Venn diagram for "A OR (B AND C)" and save it to custom.svg
npm start -- "A OR (B AND C)" -o custom.svg

# Use alternate operator syntax
npm start -- "A && (B || !C)"
```

## Limitations

- Best results with 2-3 variables; more variables may result in complex diagrams
- Currently supports up to 3 sets for clear visualization
- The NOT operator may not be visually intuitive in some cases

## License

MIT 