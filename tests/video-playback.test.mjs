import test from 'node:test'
import assert from 'node:assert/strict'
import { startVideoPlayback } from '../lib/video-playback.ts'

class Video extends EventTarget {
  currentTime = 10
  plays = 0
  pauses = 0
  play() { this.plays++; return Promise.resolve() }
  pause() { this.pauses++ }
  emit(type) { this.dispatchEvent(new Event(type)) }
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve() }

test('Hero shows poster for exactly 2000ms and repeats only after full ended event', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const video = new Video(), states = []
  const dispose = startVideoPlayback(video, 'hero-cycle', state => states.push(state))
  assert.deepEqual(states, ['poster'])
  assert.equal(video.loop, false)
  assert.equal(video.muted, true)
  assert.equal(video.playsInline, true)
  for (let cycle = 0; cycle < 4; cycle++) {
    t.mock.timers.tick(1999)
    assert.equal(video.plays, cycle)
    t.mock.timers.tick(1)
    assert.equal(video.plays, cycle + 1)
    assert.equal(video.currentTime, 0)
    assert.equal(states.at(-1), 'poster', 'buffering never exposes an empty video')
    video.emit('playing')
    assert.equal(states.at(-1), 'video')
    await flush()
    t.mock.timers.tick(90000)
    assert.equal(video.plays, cycle + 1, 'no guessed duration cuts off the film')
    video.currentTime = 90
    video.emit('ended')
    assert.equal(states.at(-1), 'poster')
  }
  dispose()
  t.mock.timers.tick(10000)
  assert.equal(video.plays, 4)
})
test('FAZA starts immediately and loops without an intermediate poster', async () => {
  const video = new Video(), states = []
  const dispose = startVideoPlayback(video, 'loop', state => states.push(state))
  assert.equal(video.loop, true)
  assert.equal(video.plays, 1)
  video.emit('playing')
  for (let n = 0; n < 3; n++) { await flush(); video.emit('ended') }
  assert.equal(video.plays, 4)
  assert.deepEqual(states, ['video'])
  dispose()
})
test('denied autoplay and media error keep fallback, without retry storms', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const video = new Video(), states = []
  video.play = () => { video.plays++; return Promise.reject(new Error('NotAllowedError')) }
  const dispose = startVideoPlayback(video, 'hero-cycle', s => states.push(s))
  t.mock.timers.tick(2000)
  await flush()
  assert.equal(states.at(-1), 'blocked')
  t.mock.timers.tick(100000)
  assert.equal(video.plays, 1)
  video.emit('error')
  video.emit('playing')
  assert.equal(states.at(-1), 'error')
  dispose()
})
test('unmount cancels timers/listeners and ignores late rejected play promises', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const video = new Video(), states = []
  const dispose = startVideoPlayback(video, 'hero-cycle', s => states.push(s))
  dispose()
  t.mock.timers.tick(2000)
  video.emit('playing'); video.emit('ended'); video.emit('error')
  assert.equal(video.plays, 0)
  assert.deepEqual(states, ['poster'])
  let reject
  video.play = () => new Promise((_, fail) => { reject = fail })
  const stop = startVideoPlayback(video, 'loop', s => states.push(s))
  stop(); reject(new Error('abort')); await flush()
  assert.deepEqual(states, ['poster'])
})
