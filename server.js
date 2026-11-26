import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')
const port = Number(process.env.PORT) || 3000

const app = express()

app.use(express.static(distDir))

// SPA fallback: any route that did not match a static file
app.use((req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(port, () => {
  console.log(`AISE site listening on port ${port}`)
})
