import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getFirebaseApp } from './firebaseClient'

export async function uploadProductImage(file: File, pathPrefix = 'products') {
  const app = getFirebaseApp()
  const storage = getStorage(app)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${pathPrefix}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, filePath)

  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
  })

  const url = await getDownloadURL(storageRef)
  return { url, path: filePath }
}
