import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Fashion items detection keywords
const fashionKeywords = {
  tops: ['t-shirt', 'chemise', 'blouse', 'pull', 'sweat', 'hoodie', 'débardeur', 'top'],
  bottoms: ['jean', 'pantalon', 'short', 'jupe', 'legging', 'jogging'],
  dresses: ['robe', 'combinaison', 'ensemble'],
  outerwear: ['veste', 'manteau', 'blouson', 'cardigan', 'parka'],
  accessories: ['sac', 'chaussures', 'baskets', 'boots', 'lunettes', 'chapeau', 'écharpe', 'ceinture'],
  jewelry: ['collier', 'bracelet', 'boucles d\'oreilles', 'montre', 'bague'],
}

// Simulate fashion item detection
function detectFashionItems(): string[] {
  const categories = Object.keys(fashionKeywords)
  const detected: string[] = []

  // Randomly select 2-4 items
  const numItems = Math.floor(Math.random() * 3) + 2

  for (let i = 0; i < numItems; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const items = fashionKeywords[category as keyof typeof fashionKeywords]
    const item = items[Math.floor(Math.random() * items.length)]

    if (!detected.includes(item)) {
      detected.push(item)
    }
  }

  return detected
}

export async function POST(request: NextRequest) {
  try {
    const { image, upscaleFactor, denoise, enhanceColors } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Process image with Sharp
    let processedImage = sharp(buffer)

    // Get metadata
    const metadata = await processedImage.metadata()
    const originalWidth = metadata.width || 800
    const originalHeight = metadata.height || 600

    // Apply upscaling
    if (upscaleFactor > 1) {
      processedImage = processedImage.resize(
        Math.round(originalWidth * upscaleFactor),
        Math.round(originalHeight * upscaleFactor),
        {
          kernel: 'lanczos3',
          fit: 'fill',
        }
      )
    }

    // Apply denoising (median filter simulation)
    if (denoise) {
      processedImage = processedImage.median(3)
    }

    // Enhance colors
    if (enhanceColors) {
      processedImage = processedImage
        .modulate({
          brightness: 1.1,
          saturation: 1.2,
        })
        .sharpen({
          sigma: 1,
          m1: 1,
          m2: 0.2,
        })
    }

    // Convert to buffer
    const enhancedBuffer = await processedImage
      .png({ quality: 100, compressionLevel: 6 })
      .toBuffer()

    // Convert back to base64
    const enhancedBase64 = `data:image/png;base64,${enhancedBuffer.toString('base64')}`

    // Detect fashion items
    const detectedItems = detectFashionItems()

    return NextResponse.json({
      enhancedImage: enhancedBase64,
      detectedItems,
      metadata: {
        originalSize: { width: originalWidth, height: originalHeight },
        enhancedSize: {
          width: Math.round(originalWidth * upscaleFactor),
          height: Math.round(originalHeight * upscaleFactor),
        },
      },
    })
  } catch (error) {
    console.error('Error enhancing image:', error)
    return NextResponse.json(
      { error: 'Failed to enhance image' },
      { status: 500 }
    )
  }
}
