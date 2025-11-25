import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// UGC narration templates
const narrationTemplates = {
  tiktok: [
    "Découvrez cette pièce incroyable ! 😍",
    "Le look parfait pour cet automne ✨",
    "J'adore ce style, vous en pensez quoi ? 💕",
    "Coup de cœur du jour ! 🔥",
  ],
  instagram: [
    "L'élégance à l'état pur ✨",
    "Confort et style réunis",
    "La tendance de la saison",
    "Un incontournable de ma garde-robe",
  ],
  authentic: [
    "Honnêtement, je porte ça tout le temps",
    "Super qualité, je recommande vraiment",
    "Exactement ce que je cherchais",
    "Parfait pour un look décontracté",
  ],
}

// Generate narration based on detected items and style
function generateNarration(
  items: string[],
  style: 'tiktok' | 'instagram' | 'authentic'
): string {
  const templates = narrationTemplates[style]
  const template = templates[Math.floor(Math.random() * templates.length)]

  const itemsList = items.join(', ')
  return `${template}\n\n${itemsList.charAt(0).toUpperCase() + itemsList.slice(1)}`
}

// Create a simple video from image (canvas-based animation)
async function createVideoFromImage(
  imageBase64: string,
  duration: number,
  style: string,
  narration: string
): Promise<string> {
  // In a real implementation, this would use ffmpeg or a video processing library
  // For this demo, we'll create a data URL representing the video

  // Create video metadata
  const videoData = {
    image: imageBase64,
    duration,
    style,
    narration,
    effects: getVideoEffects(style),
    timestamp: Date.now(),
  }

  // In production, you would:
  // 1. Extract frames from the image
  // 2. Apply zoom/pan effects
  // 3. Add transitions
  // 4. Overlay text/narration
  // 5. Encode to MP4 with ffmpeg

  // For demo purposes, create a simple HTML5 video representation
  const videoHTML = createVideoHTML(videoData)

  // Return a blob URL that will be handled client-side
  return `data:text/html;base64,${Buffer.from(videoHTML).toString('base64')}`
}

function getVideoEffects(style: string) {
  const effects = {
    tiktok: {
      transition: 'zoom-in',
      speed: 'fast',
      filters: ['vibrant', 'sharp'],
    },
    instagram: {
      transition: 'pan-smooth',
      speed: 'medium',
      filters: ['elegant', 'soft'],
    },
    authentic: {
      transition: 'minimal',
      speed: 'natural',
      filters: ['natural', 'warm'],
    },
  }

  return effects[style as keyof typeof effects] || effects.authentic
}

function createVideoHTML(videoData: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    #videoContainer {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #mainImage {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      animation: ${videoData.effects.transition} ${videoData.duration}s ease-in-out infinite;
    }
    #narration {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-family: Arial, sans-serif;
      font-size: 18px;
      text-align: center;
      max-width: 80%;
      animation: fadeIn 1s ease-in;
    }
    @keyframes zoom-in {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes pan-smooth {
      0% { transform: translateX(0) scale(1.05); }
      50% { transform: translateX(-20px) scale(1.1); }
      100% { transform: translateX(0) scale(1.05); }
    }
    @keyframes minimal {
      0%, 100% { opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  </style>
</head>
<body>
  <div id="videoContainer">
    <img id="mainImage" src="${videoData.image}" alt="Fashion UGC">
    <div id="narration">${videoData.narration}</div>
  </div>
</body>
</html>
`
}

export async function POST(request: NextRequest) {
  try {
    const { image, detectedItems, duration, style, addNarration } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Generate narration
    const narration = addNarration
      ? generateNarration(detectedItems, style)
      : ''

    // Create video
    const videoUrl = await createVideoFromImage(image, duration, style, narration)

    return NextResponse.json({
      videoUrl,
      narration,
      metadata: {
        duration,
        style,
        detectedItems,
        effects: getVideoEffects(style),
      },
    })
  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}
