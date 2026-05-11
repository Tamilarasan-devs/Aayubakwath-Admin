import { useState, useCallback, useRef } from 'react'
import { clsx } from 'clsx'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
const MAX_FILE_SIZE_MB = 10

export function FileUpload({ onChange, maxFiles = 20, preview = true, className = '' }) {
  const [dragOver, setDragOver] = useState(false)
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const validateFile = useCallback((file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only PNG, JPG, and WEBP images are allowed.'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File exceeds ${MAX_FILE_SIZE_MB}MB limit.`
    }
    return null
  }, [])

  const addFiles = useCallback((files) => {
    setError('')
    const fileArray = Array.from(files)

    if (previews.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`)
      return
    }

    for (const file of fileArray) {
      const err = validateFile(file)
      if (err) {
        setError(err)
        return
      }
    }

    const newPreviews = fileArray.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }))

    setPreviews(prev => [...prev, ...newPreviews])
    onChange([...previews, ...newPreviews].map(p => p.file))
  }, [previews, maxFiles, validateFile, onChange])

  const removeFile = useCallback((index) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      const next = prev.filter((_, i) => i !== index)
      onChange(next.map(p => p.file))
      return next
    })
  }, [onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleInputChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }, [addFiles])

  return (
    <div className={className}>
      <div
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200',
          dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300',
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Drag & drop images here
        </p>
        <p className="text-xs text-gray-400">
          or <span className="text-gray-700 font-medium">browse files</span> — PNG, JPG, WEBP · Max {MAX_FILE_SIZE_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>
      )}

      {preview && previews.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {previews.map((p, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                  className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
