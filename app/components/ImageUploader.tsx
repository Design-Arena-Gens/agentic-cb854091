'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez télécharger une image valide')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (preview) {
      onImageUpload(preview)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-fashion-dark mb-6 text-center">
        📤 Téléchargez votre photo mode
      </h2>

      <div
        className={`upload-zone ${dragActive ? 'border-fashion-primary bg-fashion-primary/5' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {!preview ? (
          <div>
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl font-semibold text-fashion-dark mb-2">
              Glissez-déposez votre image ici
            </p>
            <p className="text-gray-500 mb-4">ou cliquez pour parcourir</p>
            <p className="text-sm text-gray-400">
              Formats acceptés : JPG, PNG, WebP
            </p>
          </div>
        ) : (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm text-gray-500">Cliquez pour changer l'image</p>
          </div>
        )}
      </div>

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center gap-4"
        >
          <button
            onClick={() => setPreview(null)}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Continuer →
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
