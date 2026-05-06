
import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\nania\\OneDrive\\Desktop\\REVEIL\\reveil-perfumes\\components\\store\\EditorialSections.tsx', 'utf8');

const tags = ['div', 'motion.div', 'section', 'motion.section', 'AnimatedPageSection'];

tags.forEach(tag => {
    const openCount = (content.match(new RegExp(`<${tag.replace('.', '\\.')}(\\s|>)`, 'g')) || []).length;
    const closeCount = (content.match(new RegExp(`</${tag.replace('.', '\\.')}>`, 'g')) || []).length;
    console.log(`${tag}: Open=${openCount}, Close=${closeCount}`);
});
