import { build } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const run = async () => {
  try {
    await build({
      root: __dirname,
    })
    console.log("✅ Vite build complete")
  } catch (err) {
    console.error("❌ Vite build failed", err)
    process.exit(1)
  }
}

run()
