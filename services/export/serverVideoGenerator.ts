import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { CanonicalPitchDeck, validateAndNormalizePitch } from './canonicalPitch';

export interface VideoGenerationResult {
  filePath: string;
  fileName: string;
  videoUrl: string;
  sizeBytes: number;
  durationSeconds: number;
  slideCount: number;
}

/**
 * Parses WAV file header to accurately calculate duration in seconds.
 */
function getWavDuration(filePath: string): number {
  try {
    const buffer = fs.readFileSync(filePath);
    const byteRate = buffer.readUInt32LE(28);
    let offset = 36;
    while (offset < buffer.length - 8) {
      const chunkId = buffer.toString('ascii', offset, offset + 4);
      const chunkSize = buffer.readUInt32LE(offset + 4);
      if (chunkId === 'data') {
        return chunkSize / byteRate;
      }
      offset += 8 + chunkSize;
    }
    return buffer.length / byteRate;
  } catch (e) {
    return 5.0;
  }
}

function sanitizeForFfmpeg(str: string, maxLength = 80): string {
  if (!str) return '';
  return str
    .replace(/[—–]/g, '-')
    .replace(/[^a-zA-Z0-9 .,!?:;_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Downloads an image to a local file, or returns fallback.
 */
async function ensureLocalImage(url: string, targetPath: string, fallbackPath: string): Promise<string> {
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
    return targetPath;
  }

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'PitchForge/1.0' } });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(targetPath, Buffer.from(buffer));
        return targetPath;
      }
    } catch (e) {
      // Ignore network download failure and use fallback
    }
  }

  return fallbackPath;
}

/**
 * Resolves the real path to the FFmpeg binary in both development and production Next.js bundles.
 */
export function getFfmpegBinaryPath(): string {
  if (ffmpegPath && fs.existsSync(ffmpegPath)) {
    return ffmpegPath;
  }
  const nmPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  if (fs.existsSync(nmPath)) {
    return nmPath;
  }
  return 'ffmpeg';
}

/**
 * Server-side video generator that builds an MP4 with 10 synchronized slide scenes,
 * speaker narration audio, PitchForge dark/orange editorial styling, and subtitles.
 */
export async function generatePitchVideo(rawPitch: any, customSpeakerScript?: string): Promise<VideoGenerationResult> {
  const binaryPath = getFfmpegBinaryPath();

  const deck: CanonicalPitchDeck = validateAndNormalizePitch(rawPitch);

  const outputDir = path.join(process.cwd(), 'generated');
  const tmpDir = path.join(outputDir, `tmp_${Date.now()}`);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  // Ensure a base fallback image exists
  const baseFallbackImg = path.join(process.cwd(), 'scratch', 'slide1.jpg');
  let fallbackImg = baseFallbackImg;
  if (!fs.existsSync(fallbackImg)) {
    fallbackImg = path.join(tmpDir, 'fallback_dark.jpg');
    // Generate solid dark fallback if needed
    execSync(`"${binaryPath}" -y -f lavfi -i color=c=0x080808:s=1920x1080 -vframes 1 "${fallbackImg}"`, { stdio: 'ignore' });
  }

  const clipPaths: string[] = [];
  let cumulativeDuration = 0;

  try {
    for (let i = 0; i < deck.slides.length; i++) {
      const slide = deck.slides[i];
      const slideNumStr = slide.numberFormatted;
      const wavPath = path.join(tmpDir, `narration_${slideNumStr}.wav`);
      const clipPath = path.join(tmpDir, `scene_${slideNumStr}.mp4`);
      const slideImgTarget = path.join(tmpDir, `slide_img_${slideNumStr}.jpg`);

      // 1. Resolve visual image for this slide
      const resolvedImgPath = await ensureLocalImage(slide.imageUrl, slideImgTarget, fallbackImg);

      // 2. Generate Narration Audio using Windows SAPI / System.Speech
      const scriptToSpeak = slide.speakerScript || `Slide ${slide.index}. ${slide.title}. ${slide.keyPoints.join('. ')}`;
      const cleanScript = scriptToSpeak.replace(/'/g, "''").replace(/\r?\n/g, ' ');

      let audioGenerated = false;
      try {
        const psCmd = `powershell -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Rate = 1; $synth.SetOutputToWaveFile('${wavPath.replace(/\\/g, '/')}'); $synth.Speak('${cleanScript}'); $synth.Dispose();"`;
        execSync(psCmd, { stdio: 'ignore', timeout: 15000 });
        if (fs.existsSync(wavPath) && fs.statSync(wavPath).size > 1000) {
          audioGenerated = true;
        }
      } catch (e) {
        // PowerShell TTS fallback
      }

      // 3. Determine scene duration synchronized to narration audio
      let duration = 6.0;
      if (audioGenerated) {
        duration = getWavDuration(wavPath);
      } else {
        // Calculate duration based on words (~130 wpm)
        const wordCount = scriptToSpeak.split(/\s+/).length;
        duration = Math.max(4.0, Math.min(18.0, (wordCount / 130) * 60));
      }
      duration = Math.max(3.5, Math.min(25.0, duration));
      cumulativeDuration += duration;

      // 4. Build text overlays
      const catText = sanitizeForFfmpeg(slide.canonicalLabel, 40);
      const titleText = sanitizeForFfmpeg(slide.title.toUpperCase(), 50);
      const subtitleText = sanitizeForFfmpeg(slide.subtitle, 65);
      const captionText = sanitizeForFfmpeg(slide.speakerScript, 90);

      // 5. Build FFmpeg video filter for 1080p dark cinematic styling
      const vf = [
        "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#080808",
        "drawbox=x=0:y=0:w=1920:h=1080:color=black@0.45:t=fill",
        "drawbox=x=80:y=50:w=1760:h=4:color=#FF4D00:t=fill",
        `drawtext=text='${catText}':x=80:y=80:fontsize=24:fontcolor=#FF4D00`,
        `drawtext=text='SLIDE ${slideNumStr} OF 10  *  PITCHFORGE':x=1420:y=80:fontsize=20:fontcolor=#A1A1AA`,
        `drawtext=text='${titleText}':x=80:y=130:fontsize=44:fontcolor=white`,
        `drawtext=text='${subtitleText}':x=80:y=195:fontsize=24:fontcolor=#A1A1AA`,
        // Subtitle Narration Bar at bottom
        "drawbox=x=80:y=860:w=1760:h=140:color=#111111@0.90:t=fill",
        "drawbox=x=80:y=860:w=1760:h=140:color=#FF4D00:t=2",
        "drawtext=text='SPEAKER NARRATION:':x=110:y=885:fontsize=16:fontcolor=#FF4D00",
        `drawtext=text='${captionText}':x=110:y=925:fontsize=22:fontcolor=white`
      ].join(',');

      // 6. Encode slide clip
      if (audioGenerated) {
        const renderCmd = `"${binaryPath}" -y -loop 1 -i "${resolvedImgPath}" -i "${wavPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 128k -pix_fmt yuv420p -vf "${vf}" -t ${duration.toFixed(2)} -shortest "${clipPath}"`;
        execSync(renderCmd, { stdio: 'ignore' });
      } else {
        // Fallback: silent audio track if audio wasn't generated
        const renderCmd = `"${binaryPath}" -y -loop 1 -i "${resolvedImgPath}" -f lavfi -i anullsrc=r=44100:cl=stereo -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 128k -pix_fmt yuv420p -vf "${vf}" -t ${duration.toFixed(2)} -shortest "${clipPath}"`;
        execSync(renderCmd, { stdio: 'ignore' });
      }

      if (fs.existsSync(clipPath) && fs.statSync(clipPath).size > 0) {
        clipPaths.push(clipPath);
      }
    }

    if (clipPaths.length === 0) {
      throw new Error('Failed to render any slide video scenes');
    }

    // 7. Concatenate all 10 slide scenes into one full pitch video
    const listFile = path.join(tmpDir, 'concat_list.txt');
    fs.writeFileSync(listFile, clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));

    const timestamp = Date.now();
    const safeTitle = deck.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const finalFileName = `pitchforge-${safeTitle}-${timestamp}.mp4`;
    const finalFilePath = path.join(outputDir, finalFileName);

    const concatCmd = `"${binaryPath}" -y -f concat -safe 0 -i "${listFile}" -c copy "${finalFilePath}"`;
    execSync(concatCmd, { stdio: 'ignore' });

    // 8. Validate output file (Section 16)
    if (!fs.existsSync(finalFilePath)) {
      throw new Error(`MP4 video was not created at ${finalFilePath}`);
    }

    const stats = fs.statSync(finalFilePath);
    if (stats.size === 0) {
      throw new Error('Generated MP4 video is 0 bytes');
    }

    return {
      filePath: finalFilePath,
      fileName: finalFileName,
      videoUrl: `/api/export/video/download/${encodeURIComponent(finalFileName)}`,
      sizeBytes: stats.size,
      durationSeconds: Math.round(cumulativeDuration),
      slideCount: deck.slides.length,
    };
  } finally {
    // Clean up temporary files in background
    try {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup error
    }
  }
}
