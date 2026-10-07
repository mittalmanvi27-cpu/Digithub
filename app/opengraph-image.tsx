import { ImageResponse } from 'next/og'

export const alt = 'Digitroot — Get found. Get chosen. Get growing.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(900px circle at 50% 0%, rgba(63,201,160,0.25), transparent 60%), #070B14',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#1F3A5F', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, paddingBottom: 12 }}>
            <div style={{ width: 8, height: 14, background: 'white' }} />
            <div style={{ width: 8, height: 24, background: 'white' }} />
            <div style={{ width: 8, height: 12, background: 'white' }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>Digitroot</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>Get found. Get chosen.</div>
          <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1.05, color: '#3FC9A0' }}>Get growing.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.6)' }}>SEO · AI search · Google & Meta Ads · Websites — free instant AI audit</div>
      </div>
    ),
    size,
  )
}
