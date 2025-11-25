'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUploader from './components/ImageUploader'
import ImageProcessor from './components/ImageProcessor'
import VideoGenerator from './components/VideoGenerator'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [detectedItems, setDetectedItems] = useState<string[]>([])
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    setCurrentStep(2)
  }

  const handleImageEnhanced = (enhancedData: string, items: string[]) => {
    setEnhancedImage(enhancedData)
    setDetectedItems(items)
    setCurrentStep(3)
  }

  const handleVideoGenerated = (videoData: string) => {
    setGeneratedVideo(videoData)
    setCurrentStep(4)
  }

  const resetAll = () => {
    setUploadedImage(null)
    setEnhancedImage(null)
    setDetectedItems([])
    setGeneratedVideo(null)
    setCurrentStep(1)
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-fashion-dark mb-4">
            Fashion UGC Generator
            <span className="block text-3xl text-fashion-primary mt-2">
              ✨ IA · Image · Vidéo Mode
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Améliorez vos photos mode et créez des vidéos UGC authentiques automatiquement
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: 'Upload' },
              { num: 2, label: 'Enhance' },
              { num: 3, label: 'Generate UGC' },
              { num: 4, label: 'Download' }
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: currentStep >= step.num ? 1 : 0.8,
                    backgroundColor: currentStep >= step.num ? '#FF6B9D' : '#E5E7EB'
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {step.num}
                </motion.div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step.num ? 'text-fashion-primary' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {idx < 3 && (
                  <div className={`w-16 h-1 mx-4 ${currentStep > step.num ? 'bg-fashion-primary' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ImageUploader onImageUpload={handleImageUpload} />
            </motion.div>
          )}

          {currentStep === 2 && uploadedImage && (
            <motion.div
              key="process"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ImageProcessor
                originalImage={uploadedImage}
                onImageEnhanced={handleImageEnhanced}
              />
            </motion.div>
          )}

          {currentStep === 3 && enhancedImage && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <VideoGenerator
                enhancedImage={enhancedImage}
                detectedItems={detectedItems}
                onVideoGenerated={handleVideoGenerated}
              />
            </motion.div>
          )}

          {currentStep === 4 && generatedVideo && enhancedImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-fashion-dark mb-6 text-center">
                🎉 Résultats Finaux
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Enhanced Image */}
                <div>
                  <h3 className="text-xl font-semibold text-fashion-dark mb-4">
                    📸 Image Améliorée
                  </h3>
                  <img
                    src={enhancedImage}
                    alt="Enhanced"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <a
                    href={enhancedImage}
                    download="enhanced-image.png"
                    className="btn-primary w-full mt-4 block text-center"
                  >
                    Télécharger l'image
                  </a>
                </div>

                {/* Generated Video */}
                <div>
                  <h3 className="text-xl font-semibold text-fashion-dark mb-4">
                    🎬 Vidéo UGC
                  </h3>
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full rounded-lg shadow-lg"
                  />
                  <a
                    href={generatedVideo}
                    download="ugc-video.mp4"
                    className="btn-primary w-full mt-4 block text-center"
                  >
                    Télécharger la vidéo
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button onClick={resetAll} className="btn-secondary">
                  ↻ Créer une nouvelle génération
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="card text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-fashion-dark mb-2">
              Amélioration IA
            </h3>
            <p className="text-gray-600">
              Upscale, débruitage et optimisation des couleurs sans altérer le style
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👗</div>
            <h3 className="text-xl font-bold text-fashion-dark mb-2">
              Détection Mode
            </h3>
            <p className="text-gray-600">
              Identification automatique des vêtements et accessoires
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-fashion-dark mb-2">
              Vidéo UGC
            </h3>
            <p className="text-gray-600">
              Création de contenu authentique style TikTok/Instagram Reels
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
