import * as fs from 'fs';
import * as path from 'path';

const generatedDirectory = path.join(__dirname, '../generated');
const indexPath = path.join(generatedDirectory, 'index.ts');

const files = fs
  .readdirSync(generatedDirectory)
  .filter(
    (file) =>
      file.endsWith('.ts') && file !== 'index.ts' && !file.endsWith('.d.ts')
  );

const exportedFiles = files
  .map((file) => {
    const moduleName = path.basename(file, '.ts');
    return `export * from './${moduleName}';`;
  })
  .join('\n');

fs.writeFileSync(indexPath, exportedFiles + '\n');
