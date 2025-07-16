#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

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

console.log('📝 Starting DOCX conversion...\n');

// Function to convert markdown to DOCX
async function convertToDocx(inputFile, outputFile) {
  try {
    // Read markdown file
    const markdownContent = fs.readFileSync(inputFile, 'utf8');
    
    // Parse markdown to tokens
    const tokens = marked.lexer(markdownContent);
    
    // Convert tokens to docx paragraphs
    const paragraphs = [];
    
    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          let headingLevel = HeadingLevel.HEADING_1;
          switch (token.depth) {
            case 1: headingLevel = HeadingLevel.HEADING_1; break;
            case 2: headingLevel = HeadingLevel.HEADING_2; break;
            case 3: headingLevel = HeadingLevel.HEADING_3; break;
            case 4: headingLevel = HeadingLevel.HEADING_4; break;
            default: headingLevel = HeadingLevel.HEADING_5; break;
          }
          
          paragraphs.push(
            new Paragraph({
              text: token.text.replace(/[📊🚀✅🎯🏢👥💳🧪📚🔧📈🎉📋🌐🔒⚡📁🎪🏥🤖📱🔍👶🎯👁️👂🥗🧘🦷🌟💰🔄📊🚨🏗️⚙️🗄️🔐📋⚡🧪📖👔⚙️📊📈🎊🤝📞📄🎉]/g, ''),
              heading: headingLevel,
            })
          );
          break;
          
        case 'paragraph':
          const textRuns = [];
          let text = token.text;
          
          // Remove emojis for cleaner DOCX
          text = text.replace(/[📊🚀✅🎯🏢👥💳🧪📚🔧📈🎉📋🌐🔒⚡📁🎪🏥🤖📱🔍👶🎯👁️👂🥗🧘🦷🌟💰🔄📊🚨🏗️⚙️🗄️🔐📋⚡🧪📖👔⚙️📊📈🎊🤝📞📄🎉]/g, '');
          
          // Handle bold text
          text = text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
            textRuns.push(new TextRun({ text: p1, bold: true }));
            return '|||BOLD|||';
          });
          
          // Handle italic text
          text = text.replace(/\*(.*?)\*/g, (match, p1) => {
            textRuns.push(new TextRun({ text: p1, italics: true }));
            return '|||ITALIC|||';
          });
          
          // Handle code text
          text = text.replace(/`(.*?)`/g, (match, p1) => {
            textRuns.push(new TextRun({ text: p1, font: 'Courier New' }));
            return '|||CODE|||';
          });
          
          if (textRuns.length === 0) {
            paragraphs.push(new Paragraph({ text: text }));
          } else {
            // Split text and insert formatted runs
            const parts = text.split(/\|\|\|(BOLD|ITALIC|CODE)\|\|\|/);
            const finalRuns = [];
            let runIndex = 0;
            
            for (let i = 0; i < parts.length; i++) {
              if (parts[i] && !['BOLD', 'ITALIC', 'CODE'].includes(parts[i])) {
                finalRuns.push(new TextRun({ text: parts[i] }));
              } else if (['BOLD', 'ITALIC', 'CODE'].includes(parts[i])) {
                if (textRuns[runIndex]) {
                  finalRuns.push(textRuns[runIndex]);
                  runIndex++;
                }
              }
            }
            
            paragraphs.push(new Paragraph({ children: finalRuns }));
          }
          break;
          
        case 'list':
          for (const item of token.items) {
            let itemText = item.text.replace(/[📊🚀✅🎯🏢👥💳🧪📚🔧📈🎉📋🌐🔒⚡📁🎪🏥🤖📱🔍👶🎯👁️👂🥗🧘🦷🌟💰🔄📊🚨🏗️⚙️🗄️🔐📋⚡🧪📖👔⚙️📊📈🎊🤝📞📄🎉]/g, '');
            paragraphs.push(
              new Paragraph({
                text: `• ${itemText}`,
                bullet: { level: 0 }
              })
            );
          }
          break;
          
        case 'code':
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: token.text,
                  font: 'Courier New',
                  size: 20
                })
              ]
            })
          );
          break;
          
        case 'space':
          paragraphs.push(new Paragraph({ text: '' }));
          break;
          
        default:
          // Handle other token types as plain text
          if (token.text) {
            let cleanText = token.text.replace(/[📊🚀✅🎯🏢👥💳🧪📚🔧📈🎉📋🌐🔒⚡📁🎪🏥🤖📱🔍👶🎯👁️👂🥗🧘🦷🌟💰🔄📊🚨🏗️⚙️🗄️🔐📋⚡🧪📖👔⚙️📊📈🎊🤝📞📄🎉]/g, '');
            paragraphs.push(new Paragraph({ text: cleanText }));
          }
          break;
      }
    }
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });
    
    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Write to file
    fs.writeFileSync(outputFile, buffer);
    
    console.log(`✅ Successfully converted ${inputFile} to DOCX`);
    
  } catch (error) {
    console.error(`❌ Error converting ${inputFile} to DOCX:`, error.message);
  }
}

// Main conversion function
async function convertAllToDocx() {
  console.log(`📝 Converting ${markdownFiles.length} files to DOCX...\n`);

  for (const file of markdownFiles) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    const baseName = path.basename(file, '.md');
    const docxOutput = path.join(outputDir, `${baseName}.docx`);

    await convertToDocx(file, docxOutput);
  }

  console.log('\n🎉 DOCX conversion complete!');
  console.log(`📁 Output directory: ${outputDir}`);
  
  // List all generated files
  const files = fs.readdirSync(outputDir);
  const docxFiles = files.filter(f => f.endsWith('.docx'));
  
  console.log('\n📋 Generated DOCX files:');
  docxFiles.forEach(file => {
    console.log(`   📄 ${file}`);
  });
}

// Run the conversion
convertAllToDocx().catch(console.error);
