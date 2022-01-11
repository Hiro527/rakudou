const fs = require('fs');
const ytdl = require('ytdl-core');
const child_process = require('child_process');
const { exit } = require('process');
const readline = require('readline');

const packageInfo = require('./package.json');

/**
 * @type {String}
 */
const url = process.argv[2];
const mode = process.argv[3] ?? 'mp4';

console.log(`
######     ##     ###  ##  ##   ##  #####     #####   ##   ##
 ##  ##   ####     ##  ##  ##   ##   ## ##   ##   ##  ##   ##
 ##  ##  ##  ##    ## ##   ##   ##   ##  ##  ##   ##  ##   ##
 #####   ##  ##    ####    ##   ##   ##  ##  ##   ##  ##   ##
 ## ##   ######    ## ##   ##   ##   ##  ##  ##   ##  ##   ##
 ##  ##  ##  ##    ##  ##  ##   ##   ## ##   ##   ##  ##   ##
#### ##  ##  ##   ###  ##   #####   #####     #####    #####   v${packageInfo.version} / (c)2021 Hiro527
`);

const download = async () => {
    const videoInfo = await ytdl.getInfo(url);
    const date = new Date();
    const fileName = `${videoInfo.videoDetails.title}_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`.replaceAll('/', ' ');
    const videoSec = videoInfo.videoDetails.lengthSeconds;
    console.log('%s | %s - %s', videoInfo.videoDetails.title, videoInfo.videoDetails.author.name, `${('00' + Math.floor(videoSec / 3600)).slice(-2)}:${('00' + Math.floor(videoSec / 60) % 60).slice(-2)}:${('00' + (videoSec % 60) % 60).slice(-2)}`);
    let startTime = 0;
    const tracker = {
        video: { downloaded: 0, total: 0 },
        audio: { downloaded: 0, total: 0 },
    };
    const video = ytdl(url, { filter: (format) => format.container === 'mp4', quality: 'highestvideo' });
    const audio = ytdl(url, { quality: 'highestaudio' });
    video.once('response', () => startTime = Date.now());
    video.on('progress', (chunkLength, downloaded, total) => {
        tracker.video.downloaded = downloaded;
        tracker.video.total = total;
    });
    audio.on('progress', (chunkLength, downloaded, total) => {
        tracker.audio.downloaded = downloaded;
        tracker.audio.total = total;
    });
    const ffmpeg = child_process.spawn('ffmpeg', [
        '-loglevel', '8', '-hide_banner',
        '-progress', 'pipe:3',
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        '-map', '0:a',
        '-map', '1:v',
        '-c:v', 'copy',
        `output/${fileName}.mp4`,
    ], {
        windowsHide: true,
        stdio: [
            'inherit', 'inherit', 'inherit',
            'pipe', 'pipe', 'pipe',
        ],
    });
    ffmpeg.on('close', () => {
        clearInterval(trackerInterval);
        console.log(`\n[INFO] ダウンロードが完了しました: ./output/${fileName}.mp4`);
        if (mode === 'mp3') {
            console.log('[INFO] mp3への変換を開始します');
            const ffmpegMp3 = child_process.spawn('ffmpeg', [
                '-loglevel', '8', '-hide_banner',
                '-i', `output/${fileName}.mp4`,
                '-vn',
                '-ab', '320k',
                '-ac', '2',
                '-ar', '44100',
                '-acodec', 'libmp3lame',
                '-f', 'mp3', `output/${fileName}.mp3`,
            ]);
            ffmpegMp3.on('close', () => {
                console.log(`[INFO] mp3への変換が完了しました: ./output/${fileName}.mp3`);
            });
        }
    });
    const trackerInterval = setInterval(() => {
        readline.cursorTo(process.stdout, 0);
        const timePassed = Math.floor((Date.now() - startTime) / 1000);
        const downloaded = tracker.audio.downloaded + tracker.video.downloaded;
        const total = tracker.audio.total + tracker.video.total;
        const progress = Math.floor(downloaded / total * 100);
        process.stdout.write(`${('00' + progress).slice(-3)}% [${'='.repeat(progress >= 5 ? Math.floor(progress / 5) - 1 : 0)}>${' '.repeat((20 - (Math.floor(progress / 5))))}]  |  ${('00' + Math.floor(timePassed / 3600)).slice(-2)}:${('00' + Math.floor(timePassed / 60) % 60).slice(-2)}:${('00' + (timePassed % 60) % 60).slice(-2)}`);
        process.stdout.write(`  |  ${Math.floor(downloaded / 1024 / 1024)}MB of ${Math.floor(total / 1024 / 1024)}MB`);
        readline.moveCursor(process.stdout, 0);
    }, 100);
    audio.pipe(ffmpeg.stdio[4]);
    video.pipe(ffmpeg.stdio[5]);
};

if (ytdl.validateURL(url)) {
    download();
}
else {
    console.error('[ERROR] 無効なURL: %s', url);
    exit(1);
}