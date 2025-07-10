const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class TestFileGenerator {
  constructor() {
    this.testDir = path.join(__dirname, 'test-files');
    this.sizes = {
      small: { count: 100, linesPerFile: 50 },
      medium: { count: 200, linesPerFile: 200 },
      large: { count: 100, linesPerFile: 1000 },
      xlarge: { count: 50, linesPerFile: 5000 }
    };
  }

  generateFiles() {
    console.log(chalk.blue('🏗️  Generating test files for benchmark...'));

    // Clean existing test files
    if (fs.existsSync(this.testDir)) {
      fs.rmSync(this.testDir, { recursive: true, force: true });
    }

    fs.mkdirSync(this.testDir, { recursive: true });

    // Generate files of different sizes
    Object.entries(this.sizes).forEach(([size, config]) => {
      this.generateFilesOfSize(size, config);
    });

    // Generate files with specific patterns
    this.generatePatternFiles();

    console.log(chalk.green('✅ Test files generated successfully!'));
  }

  generateFilesOfSize(size, config) {
    const sizeDir = path.join(this.testDir, size);
    fs.mkdirSync(sizeDir, { recursive: true });

    console.log(chalk.yellow(`📄 Generating ${config.count} ${size} files (${config.linesPerFile} lines each)...`));

    for (let i = 0; i < config.count; i++) {
      const fileName = `${size}-file-${i + 1}.js`;
      const filePath = path.join(sizeDir, fileName);
      const content = this.generateFileContent(config.linesPerFile, i);

      fs.writeFileSync(filePath, content);
    }
  }

  generateFileContent(lines, seed) {
    const patterns = [
      this.generateBasicFunctions,
      this.generateClasses,
      this.generateModules,
      this.generateAsyncCode,
      this.generateArrayOperations,
      this.generateObjectManipulation,
      this.generateErrorHandling,
      this.generateUtilityFunctions
    ];

    let content = '';
    let currentLine = 0;

    // Add some imports and setup
    content += this.generateImports();
    currentLine += 5;

    while (currentLine < lines) {
      const patternIndex = (seed + currentLine) % patterns.length;
      const pattern = patterns[patternIndex];
      const patternContent = pattern.call(this, currentLine, seed);

      content += patternContent + '\n\n';
      currentLine += patternContent.split('\n').length + 2;
    }

    return content;
  }

  generateImports() {
    return `// Auto-generated test file for benchmarking
const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

`;
  }

  generateBasicFunctions(lineNum, seed) {
    const funcName = `function${lineNum + seed}`;
    return `function ${funcName}(param1, param2) {
  const result = param1 + param2;
  if (result > 10) {
    return result * 2;
  } else {
    return result;
  }
}

const ${funcName}Arrow = (a, b) => {
  return a * b + Math.random();
};

// This is a comment that might trigger some linting rules
var oldStyleVar = "${funcName}";
let modernLet = oldStyleVar.toUpperCase();`;
  }

  generateClasses(lineNum, seed) {
    const className = `TestClass${lineNum + seed}`;
    return `class ${className} {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  getValue() {
    return this.value;
  }

  setValue(newValue) {
    this.value = newValue;
    return this;
  }

  static createDefault() {
    return new ${className}('default', 0);
  }
}

const instance${lineNum} = new ${className}('test', ${seed});`;
  }

  generateModules(lineNum, seed) {
    const moduleName = `module${lineNum + seed}`;
    return `const ${moduleName} = {
  name: '${moduleName}',
  version: '1.0.0',

  init() {
    console.log('Initializing ' + this.name);
  },

  process(data) {
    if (!data) {
      throw new Error('Data is required');
    }
    return data.map(item => item * 2);
  },

  cleanup() {
    // Cleanup logic here
    this.name = null;
  }
};

module.exports = ${moduleName};`;
  }

  generateAsyncCode(lineNum, seed) {
    const funcName = `asyncFunction${lineNum + seed}`;
    return `async function ${funcName}() {
  try {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve('success');
        } else {
          reject(new Error('Random failure'));
        }
      }, ${seed % 100});
    });

    return result;
  } catch (error) {
    console.error('Error in ${funcName}:', error);
    throw error;
  }
}

const ${funcName}Arrow = async (param) => {
  const data = await fetch('/api/data/' + param);
  return data.json();
};`;
  }

  generateArrayOperations(lineNum, seed) {
    return `const array${lineNum} = Array.from({ length: ${seed % 20 + 5} }, (_, i) => i * 2);

const processed${lineNum} = array${lineNum}
  .filter(item => item > 5)
  .map(item => ({ value: item, squared: item * item }))
  .reduce((acc, curr) => {
    acc.sum += curr.value;
    acc.sumSquared += curr.squared;
    return acc;
  }, { sum: 0, sumSquared: 0 });

const sorted${lineNum} = [...array${lineNum}].sort((a, b) => b - a);

// Some potentially problematic patterns
var global${lineNum} = processed${lineNum};
eval('console.log("eval usage");');`;
  }

  generateObjectManipulation(lineNum, seed) {
    return `const obj${lineNum} = {
  id: ${seed},
  name: 'Object ${lineNum}',
  nested: {
    level1: {
      level2: {
        value: 'deep value'
      }
    }
  }
};

const { name, nested: { level1 } } = obj${lineNum};

const cloned${lineNum} = JSON.parse(JSON.stringify(obj${lineNum}));
cloned${lineNum}.modified = true;

Object.defineProperty(obj${lineNum}, 'computed', {
  get() {
    return this.id * 10;
  }
});`;
  }

  generateErrorHandling(lineNum, seed) {
    return `function riskyFunction${lineNum}(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (input.length === 0) {
    throw new Error('Input cannot be empty');
  }

  try {
    const parsed = JSON.parse(input);
    return parsed;
  } catch (e) {
    console.warn('Failed to parse JSON:', e.message);
    return input;
  }
}

function unsafeFunction${lineNum}() {
  // This function has various issues
  var x = 1;
  var x = 2; // redeclaration

  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i); // closure issue
    }, 100);
  }

  return x;
}`;
  }

  generateUtilityFunctions(lineNum, seed) {
    return `function debounce${lineNum}(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function memoize${lineNum}(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage with some lint issues
const debouncedLog = debounce${lineNum}(console.log, 100);
const memoizedFib = memoize${lineNum}(function(n) {
  if (n <= 1) return n;
  return memoizedFib(n - 1) + memoizedFib(n - 2);
});`;
  }

  generatePatternFiles() {
    const patternsDir = path.join(this.testDir, 'patterns');
    fs.mkdirSync(patternsDir, { recursive: true });

    console.log(chalk.yellow('🎯 Generating pattern-specific files...'));

    // Generate files with common linting issues
    this.generateLintingIssuesFile(patternsDir);
    this.generateModernJSFile(patternsDir);
    this.generateLegacyJSFile(patternsDir);
    this.generateComplexFile(patternsDir);
  }

  generateLintingIssuesFile(dir) {
    const content = `// File with common linting issues
var unused = 'this variable is never used';

function inconsistentSpacing(){
  var a=1;
  var b = 2;
  var c=  3;

  if(a==b){
    console.log("Double equals used");
  }

  // Missing semicolon
  var d = 4

  // Unreachable code
  return a;
  console.log("This will never execute");
}

// Redeclared variable
var redeclared = 1;
var redeclared = 2;

// Missing 'new' keyword
var date = Date();

// Eval usage
eval("console.log('eval is evil')");

// Alert usage
alert('This is bad in modern JS');

// Console.log (might be flagged in production)
console.log("Debug statement");

// Magic numbers
function calculatePrice(quantity) {
  return quantity * 19.99 + 5.99;
}

// Too many parameters
function tooManyParams(a, b, c, d, e, f, g, h, i, j) {
  return a + b + c + d + e + f + g + h + i + j;
}

// Nested ternary operators
const result = condition1 ? value1 : condition2 ? value2 : condition3 ? value3 : defaultValue;

// == vs === issues
if (x == null) {
  console.log('loose equality');
}

// Trailing comma issues
const obj = {
  a: 1,
  b: 2,
};

const arr = [1, 2, 3,];
`;

    fs.writeFileSync(path.join(dir, 'linting-issues.js'), content);
  }

  generateModernJSFile(dir) {
    const content = `// Modern JavaScript features and patterns
import { promises as fs } from 'fs';
import path from 'path';

// Modern class with private fields
class ModernClass {
  #privateField = 'private';

  constructor(value) {
    this.value = value;
  }

  #privateMethod() {
    return this.#privateField;
  }

  async processData(data) {
    const results = await Promise.all(
      data.map(async item => {
        const processed = await this.processItem(item);
        return processed;
      })
    );

    return results;
  }

  async processItem(item) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1));
    return item * 2;
  }
}

// Modern destructuring and spread
const config = {
  host: 'localhost',
  port: 3000,
  ssl: false,
  ...process.env.NODE_ENV === 'production' && {
    ssl: true,
    port: 443
  }
};

// Optional chaining and nullish coalescing
const getNestedValue = (obj) => {
  return obj?.nested?.deep?.value ?? 'default';
};

// Modern async/await patterns
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// Modern array methods
const processNumbers = (numbers) => {
  return numbers
    .filter(num => num > 0)
    .map(num => num ** 2)
    .reduce((sum, num) => sum + num, 0);
};

// Template literals with expressions
const createMessage = (name, age) => {
  return \`Hello \${name}, you are \${age} years old.
    \${age >= 18 ? 'You are an adult.' : 'You are a minor.'}\`;
};

// Modern export
export { ModernClass, config, getNestedValue, fetchUserData, processNumbers, createMessage };
`;

    fs.writeFileSync(path.join(dir, 'modern-js.js'), content);
  }

  generateLegacyJSFile(dir) {
    const content = `// Legacy JavaScript patterns
var LegacyModule = (function() {
  var privateVar = 'private';

  function privateFunction() {
    return privateVar;
  }

  return {
    publicMethod: function(param) {
      var result = privateFunction();
      if (param == null) {
        return result;
      }
      return result + param;
    },

    anotherMethod: function() {
      for (var i = 0; i < 10; i++) {
        setTimeout(function() {
          console.log(i); // closure issue
        }, 100);
      }
    }
  };
})();

// Old-style constructor
function OldStyleClass(name) {
  this.name = name;
  this.id = Math.random();
}

OldStyleClass.prototype.getName = function() {
  return this.name;
};

OldStyleClass.prototype.setName = function(name) {
  this.name = name;
};

// Global variable pollution
var globalVar = 'I am global';

function globalFunction() {
  implicitGlobal = 'This creates a global';
  return implicitGlobal;
}

// Callback hell
function callbackHell(callback) {
  setTimeout(function() {
    callback(null, 'first');
  }, 100);
}

callbackHell(function(err, result1) {
  if (err) return console.error(err);

  callbackHell(function(err, result2) {
    if (err) return console.error(err);

    callbackHell(function(err, result3) {
      if (err) return console.error(err);

      console.log(result1, result2, result3);
    });
  });
});

// Old-style object creation
var oldStyleObj = new Object();
oldStyleObj.prop1 = 'value1';
oldStyleObj.prop2 = 'value2';

// String concatenation instead of template literals
var message = 'Hello ' + name + ', you are ' + age + ' years old.';

// Old-style array manipulation
var arr = [1, 2, 3, 4, 5];
var doubled = [];
for (var i = 0; i < arr.length; i++) {
  doubled.push(arr[i] * 2);
}

// Function hoisting issues
console.log(hoistedFunction()); // Works due to hoisting

function hoistedFunction() {
  return 'I am hoisted';
}

console.log(hoistedVar); // undefined due to hoisting
var hoistedVar = 'I am hoisted too';
`;

    fs.writeFileSync(path.join(dir, 'legacy-js.js'), content);
  }

  generateComplexFile(dir) {
    const content = `// Complex JavaScript file with mixed patterns
class ComplexDataProcessor {
  constructor(options = {}) {
    this.options = {
      batchSize: 100,
      maxRetries: 3,
      timeout: 5000,
      ...options
    };

    this.cache = new Map();
    this.processing = false;
    this.queue = [];
    this.workers = [];
  }

  async processData(data) {
    if (!Array.isArray(data)) {
      throw new TypeError('Data must be an array');
    }

    const batches = this.createBatches(data);
    const results = [];

    for (const batch of batches) {
      try {
        const batchResult = await this.processBatch(batch);
        results.push(...batchResult);
      } catch (error) {
        console.error('Batch processing failed:', error);
        if (this.options.maxRetries > 0) {
          const retryResult = await this.retryBatch(batch, this.options.maxRetries);
          results.push(...retryResult);
        }
      }
    }

    return results;
  }

  createBatches(data) {
    const batches = [];
    const batchSize = this.options.batchSize;

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    return batches;
  }

  async processBatch(batch) {
    const promises = batch.map(item => this.processItem(item));

    return Promise.all(promises);
  }

  async processItem(item) {
    // Check cache first
    if (this.cache.has(item.id)) {
      return this.cache.get(item.id);
    }

    try {
      const result = await this.performComplexOperation(item);
      this.cache.set(item.id, result);
      return result;
    } catch (error) {
      console.error(\`Failed to process item \${item.id}:\`, error);
      throw error;
    }
  }

  async performComplexOperation(item) {
    // Simulate complex async operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({
            ...item,
            processed: true,
            processedAt: new Date().toISOString(),
            hash: this.generateHash(item)
          });
        } else {
          reject(new Error('Random processing failure'));
        }
      }, Math.random() * 100);
    });
  }

  generateHash(item) {
    return btoa(JSON.stringify(item)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
  }

  async retryBatch(batch, maxRetries) {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(\`Retry attempt \${attempt + 1} for batch\`);
        return await this.processBatch(batch);
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Memory cleanup
  clearCache() {
    this.cache.clear();
  }

  // Statistics
  getStats() {
    return {
      cacheSize: this.cache.size,
      queueLength: this.queue.length,
      isProcessing: this.processing
    };
  }
}

// Usage example with various patterns
const processor = new ComplexDataProcessor({
  batchSize: 50,
  maxRetries: 2
});

const sampleData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  value: Math.random() * 100,
  category: ['A', 'B', 'C'][i % 3],
  metadata: {
    created: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    priority: Math.floor(Math.random() * 10)
  }
}));

// Async IIFE
(async () => {
  try {
    const results = await processor.processData(sampleData);
    console.log(\`Processed \${results.length} items\`);

    const stats = processor.getStats();
    console.log('Processing stats:', stats);
  } catch (error) {
    console.error('Processing failed:', error);
  } finally {
    processor.clearCache();
  }
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComplexDataProcessor;
}
`;

    fs.writeFileSync(path.join(dir, 'complex-processing.js'), content);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  const generator = new TestFileGenerator();
  generator.generateFiles();
}

module.exports = TestFileGenerator;
