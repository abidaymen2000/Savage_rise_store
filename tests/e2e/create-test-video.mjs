// Generate a 1.25s synthetic clip; no production video is read or modified.
import { spawnSync } from 'node:child_process'
if (!process.argv[2] || !process.env.FFMPEG_PATH) throw new Error('Set FFMPEG_PATH and provide a local output .webm path')
const result = spawnSync(process.env.FFMPEG_PATH, ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=480x270:rate=12', '-t', '1.25', '-c:v', 'libvpx', '-b:v', '150k', '-an', '-y', process.argv[2]], { windowsHide: true, encoding: 'utf8' })
if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'Video generation failed')
console.log('Synthetic local clip created')
