'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ImageProcessorProps {
  originalImage: string
  onImageEnhanced: (enhancedImage: string, detectedItems: string[]) => void
}

export default function ImageProcessor({ originalImage, onImageEnhanced }: ImageProcessorProps) {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [upscaleFactor, setUpscaleFactor] = useState(2)
  const [denoise, setDenoise] = useState(true)
  const [enhanceColors, setEnhanceColors] = useState(true)

  const processSteps = [
    { name: 'Analyse de l\'image...', duration: 1000 },
    { name: 'Upscaling ×' + upscaleFactor + '...', duration: 2000 },
    { name: 'Débruitage...', duration: 1500 },
    { name: 'Amélioration des couleurs...', duration: 1500 },
    { name: 'Détection des vêtements...', duration: 2000 },
    { name: 'Finalisation...', duration: 1000 },
  ]

  const handleProcess = async () => {
    setProcessing(true)
    setProgress(0)

    // Simulate processing steps
    for (let i = 0; i < processSteps.length; i++) {
      setCurrentStep(processSteps[i].name)
      await new Promise(resolve => setTimeout(resolve, processSteps[i].duration))
      setProgress(((i + 1) / processSteps.length) * 100)
    }

    // Call API to process image
    try {
      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          upscaleFactor,
          denoise,
          enhanceColors,
        }),
      })

      const data = await response.json()
      onImageEnhanced(data.enhancedImage, data.detectedItems)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Erreur lors du traitement de l\'image')
      setProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-fashion-dark mb-6 text-center">
        ✨ Amélioration de l'image
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Original Image */}
        <div>
          <h3 className="text-lg font-semibold text-fashion-dark mb-3">
            Image originale
          </h3>
          <img
            src={originalImage}
            alt="Original"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-semibold text-fashion-dark mb-3">
            Paramètres d'amélioration
          </h3>

          <div className="space-y-4 bg-gray-50 rounded-lg p-6">
            {/* Upscale Factor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facteur d'upscale : ×{upscaleFactor}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={upscaleFactor}
                onChange={(e) => setUpscaleFactor(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                disabled={processing}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>×1</span>
                <span>×2</span>
                <span>×3</span>
                <span>×4</span>
              </div>
            </div>

            {/* Denoise */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Réduction du bruit
              </label>
              <button
                onClick={() => setDenoise(!denoise)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  denoise ? 'bg-fashion-primary' : 'bg-gray-300'
                }`}
                disabled={processing}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    denoise ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Enhance Colors */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Amélioration des couleurs
              </label>
              <button
                onClick={() => setEnhanceColors(!enhanceColors)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enhanceColors ? 'bg-fashion-primary' : 'bg-gray-300'
                }`}
                disabled={processing}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enhanceColors ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Note :</strong> L'amélioration préserve le style original
                sans modifier les visages ou les vêtements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Progress */}
      {processing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fashion-dark">
                {currentStep}
              </span>
              <span className="text-sm font-semibold text-fashion-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-fashion-primary to-fashion-secondary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleProcess}
          disabled={processing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? '⏳ Traitement en cours...' : '✨ Améliorer l\'image'}
        </button>
      </div>
    </motion.div>
  )
}
