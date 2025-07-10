#!/usr/bin/env node

const { execSync } = require('child_process');
const { performance } = require('perf_hooks');
const chalk = require('chalk');

console.log(chalk.blue('🚀 CI/CD Performance Benchmark: Oxlint vs ESLint'));
console.log(chalk.blue('=================================================='));

// Function to run benchmark with timing
function runBenchmark(name, command, cores = null) {
  console.log(chalk.yellow(`\n📊 Running ${name}${cores ? ` (${cores} cores)` : ''}...`));

  const start = performance.now();
  let output = '';
  let errors = 0;
  let warnings = 0;

  try {
    if (cores) {
      // Limit CPU cores for CI simulation
      output = execSync(`taskset -c 0-${cores-1} ${command}`, {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10
      });
    } else {
      output = execSync(command, {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10
      });
    }

    const duration = performance.now() - start;
    
    // Count issues
    const issueCount = countIssues(output, name);
    errors = issueCount.errors;
    warnings = issueCount.warnings;
    
    console.log(chalk.green(`✅ ${name} completed in ${duration.toFixed(2)}ms`));
    console.log(chalk.gray(`   Issues: ${errors} errors, ${warnings} warnings`));
    return { duration, errors, warnings };

  } catch (error) {
    const duration = performance.now() - start;
    
    // Count issues from stderr output
    const issueCount = countIssues(error.stdout || '', name);
    errors = issueCount.errors;
    warnings = issueCount.warnings;
    
    console.log(chalk.yellow(`⚠️  ${name} completed with warnings in ${duration.toFixed(2)}ms`));
    console.log(chalk.gray(`   Issues: ${errors} errors, ${warnings} warnings`));
    return { duration, errors, warnings };
  }
}

// Function to count errors and warnings
function countIssues(output, linterName) {
  let errors = 0;
  let warnings = 0;

  if (linterName.includes('ESLint')) {
    // ESLint output parsing
    try {
      const results = JSON.parse(output);
      if (Array.isArray(results)) {
        results.forEach(file => {
          if (file.messages) {
            file.messages.forEach(msg => {
              if (msg.severity === 2) errors++;
              else if (msg.severity === 1) warnings++;
            });
          }
        });
      }
    } catch (e) {
      // Fallback: count from text output
      const errorMatches = output.match(/error/gi) || [];
      const warningMatches = output.match(/warning/gi) || [];
      errors = errorMatches.length;
      warnings = warningMatches.length;
    }
  } else if (linterName.includes('Oxlint')) {
    // Oxlint output parsing - different JSON structure
    try {
      const results = JSON.parse(output);
      if (results && results.diagnostics && Array.isArray(results.diagnostics)) {
        results.diagnostics.forEach(diagnostic => {
          if (diagnostic.severity === 'error') {
            errors++;
          } else if (diagnostic.severity === 'warning') {
            warnings++;
          }
        });
      }
    } catch (e) {
      // Fallback: count from text output
      const lines = output.split('\n');
      lines.forEach(line => {
        if (line.includes('error')) errors++;
        else if (line.includes('warning') || line.includes('⚠')) warnings++;
      });
    }
  }

  return { errors, warnings };
}

// Main benchmark
async function main() {
  console.log(chalk.cyan('\n🔍 Testing on generated files...'));

  // Single core (CI simulation)
  console.log(chalk.magenta('\n=== SINGLE CORE (CI Environment) ==='));
  const eslintSingleCore = runBenchmark('ESLint', 'npx eslint test-files/**/*.js --format=json', 1);
  const oxlintSingleCore = runBenchmark('Oxlint', 'oxlint test-files/ --format=json', 1);

  // Multi-core (local development)
  console.log(chalk.magenta('\n=== MULTI-CORE (Local Development) ==='));
  const eslintMultiCore = runBenchmark('ESLint', 'npx eslint test-files/**/*.js --format=json');
  const oxlintMultiCore = runBenchmark('Oxlint', 'oxlint test-files/ --format=json');

  // Results
  console.log(chalk.blue('\n📋 BENCHMARK RESULTS'));
  console.log(chalk.blue('===================='));

  console.log(chalk.white('\n🖥️  SINGLE CORE (CI):'));
  console.log(`ESLint:  ${eslintSingleCore.duration.toFixed(2)}ms (${eslintSingleCore.errors} errors, ${eslintSingleCore.warnings} warnings)`);
  console.log(`Oxlint:  ${oxlintSingleCore.duration.toFixed(2)}ms (${oxlintSingleCore.errors} errors, ${oxlintSingleCore.warnings} warnings)`);
  console.log(`Speedup: ${(eslintSingleCore.duration/oxlintSingleCore.duration).toFixed(2)}x faster`);

  console.log(chalk.white('\n🚀 MULTI-CORE (Local):'));
  console.log(`ESLint:  ${eslintMultiCore.duration.toFixed(2)}ms (${eslintMultiCore.errors} errors, ${eslintMultiCore.warnings} warnings)`);
  console.log(`Oxlint:  ${oxlintMultiCore.duration.toFixed(2)}ms (${oxlintMultiCore.errors} errors, ${oxlintMultiCore.warnings} warnings)`);
  console.log(`Speedup: ${(eslintMultiCore.duration/oxlintMultiCore.duration).toFixed(2)}x faster`);

  // CI Impact
  const ciTimeSaving = eslintSingleCore.duration - oxlintSingleCore.duration;
  console.log(chalk.green(`\n💡 CI Time Saving: ${ciTimeSaving.toFixed(2)}ms (${((ciTimeSaving/eslintSingleCore.duration)*100).toFixed(1)}%)`));
  
  // Issue comparison
  console.log(chalk.cyan('\n🔍 Issue Detection Comparison:'));
  console.log(`ESLint found: ${eslintSingleCore.errors} errors, ${eslintSingleCore.warnings} warnings`);
  console.log(`Oxlint found: ${oxlintSingleCore.errors} errors, ${oxlintSingleCore.warnings} warnings`);
}

main().catch(console.error);
