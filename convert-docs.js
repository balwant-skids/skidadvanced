#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// List of markdown files to convert
const markdownFiles = [
  'README.md',
  'README_COMPREHENSIVE.md', 
  'README_TESTING.md',
  'DEPLOYMENT_COMPLETE.md',
  'docs/USER_MANUAL_NON_IT.md',
  'docs/INTERNAL_TESTING_DEPLOYMENT_PLAN.md',
  'docs/PRODUCTION_DEPLOYMENT_GUIDE.md',
  'docs/KRA_SLA_FRAMEWORK.md'
];

// Create output directory
const outputDir = 'documentation-exports';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('🚀 Starting documentation conversion...\n');

// Function to convert markdown to PDF
function convertToPDF(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    const command = `export PATH="/Users/satish/.nvm/versions/node/v20.19.2/bin:$PATH" && markdown-pdf "${inputFile}" -o "${outputFile}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error converting ${inputFile} to PDF:`, error.message);
        reject(error);
      } else {
        console.log(`✅ Successfully converted ${inputFile} to PDF`);
        resolve();
      }
    });
  });
}

// Function to create HTML version (for DOCX conversion)
function convertToHTML(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // Simple markdown to HTML conversion
      let html = data
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // Wrap in basic HTML structure
      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SKIDS Advanced Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
        h2 { color: #34495e; border-bottom: 1px solid #bdc3c7; }
        h3 { color: #7f8c8d; }
        code { background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .emoji { font-size: 1.2em; }
    </style>
</head>
<body>
    <p>${html}</p>
</body>
</html>`;

      fs.writeFile(outputFile, fullHTML, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Successfully converted ${inputFile} to HTML`);
          resolve();
        }
      });
    });
  });
}

// Main conversion function
async function convertAllFiles() {
  console.log(`📚 Converting ${markdownFiles.length} documentation files...\n`);

  for (const file of markdownFiles) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const baseName = path.basename(file, '.md');
    const pdfOutput = path.join(outputDir, `${baseName}.pdf`);
    const htmlOutput = path.join(outputDir, `${baseName}.html`);

    try {
      // Convert to PDF
      await convertToPDF(file, pdfOutput);
      
      // Convert to HTML (can be opened in Word for DOCX conversion)
      await convertToHTML(file, htmlOutput);
      
    } catch (error) {
      console.error(`❌ Failed to convert ${file}:`, error.message);
    }
  }

  console.log('\n🎉 Documentation conversion complete!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log('\n📋 Generated files:');
  
  // List generated files
  const files = fs.readdirSync(outputDir);
  files.forEach(file => {
    console.log(`   📄 ${file}`);
  });

  console.log('\n💡 To convert HTML files to DOCX:');
  console.log('   1. Open the HTML files in Microsoft Word');
  console.log('   2. Save As > Word Document (.docx)');
  console.log('   3. Or use online converters like pandoc or convertio.co');
}

// Run the conversion
convertAllFiles().catch(console.error);
