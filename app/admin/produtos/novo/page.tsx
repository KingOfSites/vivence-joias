'use client'

import { useState } from 'react'
import { uploadProductImage } from '@/lib/firebaseStorage'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [collection, setCollection] = useState('')
  const [material, setMaterial] = useState('')
  const [sizes, setSizes] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpload = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadProductImage(file)
      setMainImage(result.url)
    } catch {
      setError('Upload failed. Check Firebase Storage rules and config.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const priceValue = price.trim() ? Number(price.replace(',', '.')) : null
      const sizesValue = sizes.trim()
        ? sizes
            .split(',')
            .map((item) => Number(item.trim()))
            .filter((item) => Number.isFinite(item))
        : []

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          price: priceValue,
          description: description.trim(),
          collection: collection.trim(),
          material: material.trim(),
          sizes: sizesValue,
          mainImage: mainImage.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Failed to create product')
      }

      setSuccess('Product created')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>New Product</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <label>
          Slug
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <label>
          Price (e.g. 1500.00)
          <input value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Collection
          <input value={collection} onChange={(e) => setCollection(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Material
          <input value={material} onChange={(e) => setMaterial(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Sizes (comma separated, e.g. 12,13,14)
          <input value={sizes} onChange={(e) => setSizes(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} style={{ width: '100%' }} />
        </label>
        <label>
          Main Image URL
          <input value={mainImage} onChange={(e) => setMainImage(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Upload Image (Firebase)
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
        </label>
        <button type="submit" disabled={saving || uploading}>
          {saving ? 'Saving...' : 'Create Product'}
        </button>
        {uploading && <p>Uploading image...</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </main>
  )
}
