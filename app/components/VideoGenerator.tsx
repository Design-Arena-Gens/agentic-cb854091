'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface VideoGeneratorProps {
  enhancedImage: string
  detectedItems: string[]
  onVideoGenerated: (videoUrl: string) => void
}

export default function VideoGenerator({ enhancedImage, detectedItems, onVideoGenerated }: VideoGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(15)
  const [videoStyle, setVideoStyle] = useState<'tiktok' | 'instagram' | 'authentic'>('tiktok')
  const [addNarration, setAddNarration] = useState(true)

  const videoStyles = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'Dynamique et énergique' },
    { id: 'instagram', name: 'Instagram Reels', icon: '📸', description: 'Élégant et raffiné' },
    { id: 'authentic', name: 'Authentique', icon: '✨', description: 'Naturel et spontané' },
  ]

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)

    // Simulate video generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 300)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: enhancedImage,
          detectedItems,
          duration: videoDuration,
          style: videoStyle,
          addNarration,
        }),
      })

      const data = await response.json()
      clearInterval(interval)
      setProgress(100)

      setTimeout(() => {
        onVideoGenerated(data.videoUrl)
      }, 500)
    } catch (error) {
      clearInterval(interval)
      console.error('Error generating video:', error)
      alert('Erreur lors de la génération de la vidéo')
      setGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-fashion-dark mb-6 text-center">
        🎬 Génération de vidéo UGC
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-fashion-dark mb-3">
            Image améliorée
          </h3>
          <img
            src={enhancedImage}
            alt="Enhanced"
            className="w-full rounded-lg shadow-lg mb-4"
          />

          {/* Detected Items */}
          <div className="bg-gradient-to-r from-fashion-primary/10 to-fashion-secondary/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-fashion-dark mb-2">
              👗 Vêtements détectés :
            </h4>
            <div className="flex flex-wrap gap-2">
              {detectedItems.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-white px-3 py-1 rounded-full text-sm font-medium text-fashion-dark shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-semibold text-fashion-dark mb-3">
            Paramètres de la vidéo
          </h3>

          <div className="space-y-6">
            {/* Video Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Style de vidéo
              </label>
              <div className="space-y-2">
                {videoStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setVideoStyle(style.id as any)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      videoStyle === style.id
                        ? 'border-fashion-primary bg-fashion-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={generating}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{style.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-fashion-dark">
                          {style.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {style.description}
                        </div>
                      </div>
                      {videoStyle === style.id && (
                        <span className="text-fashion-primary text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée : {videoDuration} secondes
              </label>
              <input
                type="range"
                min="10"
                max="20"
                step="1"
                value={videoDuration}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                disabled={generating}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
              </div>
            </div>

            {/* Add Narration */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ajouter une narration
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Texte descriptif adapté au style
                </p>
              </div>
              <button
                onClick={() => setAddNarration(!addNarration)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  addNarration ? 'bg-fashion-primary' : 'bg-gray-300'
                }`}
                disabled={generating}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    addNarration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {generating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-fashion-primary/10 to-fashion-secondary/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fashion-dark">
                Création de votre vidéo UGC...
              </span>
              <span className="text-sm font-semibold text-fashion-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-fashion-primary to-fashion-secondary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-3">
              ⚡ Application des effets {videoStyle}, ajout des transitions...
            </p>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? '⏳ Génération en cours...' : '🎬 Générer la vidéo UGC'}
        </button>
      </div>
    </motion.div>
  )
}
