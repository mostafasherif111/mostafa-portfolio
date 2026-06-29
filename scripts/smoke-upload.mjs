import { createClient } from '@supabase/supabase-js';

function missingEnvMessage(missing) {
  return `Missing environment variable(s): ${missing.join(', ')}. Set them and retry.`;
}

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? 'portfolio';

  const missing = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    console.error(missingEnvMessage(missing));
    process.exit(2);
  }

  console.log('Using bucket:', bucket);
  const supabase = createClient(url, key);

  // tiny 1x1 transparent PNG
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgW5c5HcAAAAASUVORK5CYII=';
  const buffer = Buffer.from(base64, 'base64');

  const path = `smoke/test-${Date.now()}.png`;
  console.log('Uploading test image to', path);

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, { contentType: 'image/png' });
    console.log('upload response:', { data, error });
    if (error) {
      console.error('Upload failed:', error.message);
      process.exit(3);
    }

    // try public URL
    const pub = await supabase.storage.from(bucket).getPublicUrl(data.path);
    console.log('getPublicUrl:', pub);
    let urlResult = pub.data?.publicUrl;

    if (!urlResult) {
      // fallback to signed URL
      const signed = await supabase.storage.from(bucket).createSignedUrl(data.path, 60 * 60);
      console.log('createSignedUrl result:', signed);
      urlResult = signed.data?.signedUrl;
    }

    if (!urlResult) {
      console.error('Failed to obtain a URL for uploaded file. See above logs.');
      process.exit(4);
    }

    console.log('Upload succeeded. Accessible URL:', urlResult);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during smoke upload:', err);
    process.exit(5);
  }
}

run();
