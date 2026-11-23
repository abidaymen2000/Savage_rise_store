// Independent output directory so simultaneous Next builds cannot overwrite QA chunks.
import {execFileSync} from 'node:child_process'
import {copyFile,mkdir,readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {dirname,join} from 'node:path'
const target=process.argv[2]||'.tmp/qa/entrance-current'
const files=execFileSync('rg',['--files','--hidden','app','components','contexts','hooks','lib','public','types'],{encoding:'utf8'}).trim().split(/\r?\n/)
files.push('package.json','tsconfig.json','next-env.d.ts','next.config.mjs','postcss.config.mjs','tailwind.config.ts','image-loader.ts','middleware.ts','.eslintrc.json')
const hashes={}
for(const file of files){const data=await readFile(file);const destination=join(target,file);await mkdir(dirname(destination),{recursive:true});await copyFile(file,destination);hashes[file.replaceAll('\\','/')]=createHash('sha256').update(data).digest('hex')}
await mkdir('artifacts/entrance-restoration',{recursive:true})
await writeFile(process.argv[3]||'artifacts/entrance-restoration/source-snapshot.json',JSON.stringify({target,hashes},null,2))
console.log(`Copied ${files.length} frontend files to ${target}; environment secrets and production data excluded.`)
