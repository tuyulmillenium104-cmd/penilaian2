import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'rally-scoring-v1.7.html')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="rally-scoring-v1.7.html"'
      }
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
