# Oxlint vs ESLint CI/CD Benchmark

A comprehensive performance benchmark comparing **oxlint** and **ESLint** in CI/CD environments.

## 🎯 **Key Results**

- **Oxlint is 8.34x faster** than ESLint in single-core CI environments
- **88% time savings** in CI pipelines (6+ seconds saved per run)
- **Better issue detection**: Oxlint found 11,768 issues vs ESLint's 9,282 issues
- **Consistent performance** across different core configurations

## 📊 **Latest Benchmark Results**

```
🖥️  SINGLE CORE (CI):
ESLint:  6,872ms (8,412 errors, 870 warnings)
Oxlint:  824ms (8,468 errors, 3,300 warnings)
Speedup: 8.34x faster

🚀 MULTI-CORE (Local):
ESLint:  4,295ms (8,412 errors, 870 warnings)
Oxlint:  682ms (8,468 errors, 3,300 warnings)
Speedup: 6.30x faster

💡 CI Time Saving: 6,048ms (88.0%)
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 14+ 
- npm
- oxlint installed globally: `npm install -g oxlint`

### Installation
```bash
git clone https://github.com/yourusername/oxlint-eslint-benchmark.git
cd oxlint-eslint-benchmark
npm install
```

### Run Benchmark
```bash
npm test
```

Or run individual steps:
```bash
# Generate test files
npm run setup

# Run benchmark
npm run benchmark

# Clean up
npm run clean
```

## 📋 **What Gets Benchmarked**

### **Test Files Generated**
- **Small files**: 100 files (~50 lines each)
- **Medium files**: 200 files (~200 lines each)
- **Large files**: 100 files (~1,000 lines each)
- **XL files**: 50 files (~5,000 lines each)
- **Pattern files**: Specialized files with common linting issues

### **Performance Metrics**
- **Execution time** (single-core vs multi-core)
- **Issue detection** (errors and warnings found)
- **CI time savings** calculation

### **Test Scenarios**
- **Single-core execution** (simulates CI environment)
- **Multi-core execution** (simulates local development)
- **Real JavaScript patterns** (modern JS, legacy JS, common issues)

## 🔧 **Configuration**

### **ESLint Configuration**
Uses `.eslintrc.js` with comprehensive rules:
- Style and formatting rules
- Best practices
- Error prevention
- ES6+ features

### **Oxlint Configuration**
Uses default oxlint rules (87 rules total):
- Focused on correctness
- Performance-optimized
- Rust-based implementation

## 📈 **Understanding the Results**

### **Performance Benefits**
- **Oxlint is dramatically faster** in CI environments
- **Better scaling** with large codebases
- **Consistent performance** regardless of core count

### **Issue Detection**
- **ESLint**: Comprehensive style + correctness checking
- **Oxlint**: Focused correctness checking with some style rules
- **Both effective** at finding real issues

## 🏗️ **Architecture**

### **Project Structure**
```
oxlint-eslint-benchmark/
├── ci-benchmark.js          # Main benchmark runner
├── setup.js                 # Test file generator
├── .eslintrc.js             # ESLint configuration
├── package.json             # Project dependencies
├── README.md                # This file
├── test-files/              # Generated test files (gitignored)
└── results/                 # Benchmark results (gitignored)
```

### **Benchmark Process**
1. **Generate test files** with various JavaScript patterns
2. **Run ESLint** on all files (single-core and multi-core)
3. **Run oxlint** on all files (single-core and multi-core)
4. **Compare results** and calculate performance metrics

## 🎛️ **Customization**

### **Modify Test File Generation**
Edit `setup.js` to change:
- Number of files generated
- File size distribution
- JavaScript patterns included

### **Adjust Benchmark Parameters**
Edit `ci-benchmark.js` to change:
- Core limitation settings
- Output formatting
- Measurement precision

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the benchmark to verify results
5. Submit a pull request

## 📜 **License**

MIT License - see LICENSE file for details.

## 🙏 **Acknowledgments**

- **oxlint team** for building a fast Rust-based linter
- **ESLint team** for the comprehensive JavaScript linter
- **Community** for feedback and improvements

---

**Need help?** Open an issue or check the [troubleshooting guide](https://github.com/yourusername/oxlint-eslint-benchmark/wiki/Troubleshooting).
