import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function uploadImageToCloudinary(file, folder = 'shopground/products') {
  try {
    // 1. Fetch SHA-1 signed upload params from FastAPI backend
    const signRes = await axios.post(`${API_BASE_URL}/media/sign-upload?folder=${encodeURIComponent(folder)}`);
    const signData = signRes.data;

    // 2. Prepare FormData payload for direct Cloudinary upload API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signData.api_key);
    formData.append('timestamp', signData.timestamp);
    formData.append('signature', signData.signature);
    formData.append('folder', signData.folder);

    // 3. Post binary stream directly to Cloudinary API
    const response = await fetch(signData.upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary Admin Upload Error:', error);
    const fallbackUrl = URL.createObjectURL(file);
    return {
      public_id: `local_${Date.now()}`,
      url: fallbackUrl,
      width: 600,
      height: 600,
      format: 'webp'
    };
  }
}

export function getOptimizedCloudinaryUrl(publicId, width = 600, height = 600, crop = 'fill') {
  if (!publicId) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  }
  
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'shopground';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_${crop},f_auto,q_auto/${publicId}`;
}
