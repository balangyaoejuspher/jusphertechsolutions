import { createClient } from "@supabase/supabase-js"

export type UploadBucket = "avatars" | "logos" | "contracts"

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    return createClient(url, key)
}

export async function uploadFile(
    bucket: UploadBucket,
    path: string,
    file: File | Buffer,
    contentType?: string,
): Promise<string> {
    const supabase = getSupabase()

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType, upsert: true })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    if (bucket === "contracts") return path

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}

export async function getSignedUrl(
    bucket: UploadBucket,
    path: string,
    expiresInSeconds = 60 * 60 * 24,
): Promise<string> {
    const supabase = getSupabase()

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresInSeconds)

    if (error || !data?.signedUrl) {
        throw new Error(`Failed to generate signed URL: ${error?.message}`)
    }

    return data.signedUrl
}

export async function deleteFile(bucket: UploadBucket, path: string): Promise<void> {
    const supabase = getSupabase()
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw new Error(`Delete failed: ${error.message}`)
}

export function extractStoragePath(publicUrl: string): string {
    const url = new URL(publicUrl)
    const parts = url.pathname.split("/storage/v1/object/public/")[1]
    return parts?.split("/").slice(1).join("/") ?? ""
}