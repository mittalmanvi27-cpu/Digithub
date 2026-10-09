'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { captureAttribution, trackContact } from '@/lib/track'

const GTM = process.env.NEXT_PUBLIC_GTM_ID
const GA = process.env.NEXT_PUBLIC_GA_ID
const GADS = process.env.NEXT_PUBLIC_GADS_ID
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Loads whichever tracking is configured via env vars:
 * - NEXT_PUBLIC_GTM_ID: Google Tag Manager (recommended — manage GA4/Ads tags there), or
 * - NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GADS_ID: gtag.js directly,
 * - NEXT_PUBLIC_META_PIXEL_ID: Meta Pixel.
 * Also captures ad attribution and tracks every tel: / WhatsApp / mailto click site-wide.
 */
export function Analytics() {
  useEffect(() => {
    captureAttribution()
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      const href = a?.getAttribute('href') ?? ''
      const where = a?.dataset.track || window.location.pathname
      if (href.startsWith('tel:')) trackContact('phone', where)
      else if (/wa\.me\/|api\.whatsapp\.com/.test(href)) trackContact('whatsapp', where)
      else if (href.startsWith('mailto:')) trackContact('email', where)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  const gtagId = !GTM ? GA || GADS : undefined

  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${GA ? `gtag('config','${GA}');` : ''}${GADS ? `gtag('config','${GADS}',{allow_enhanced_conversions:true});` : ''}`}
          </Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}
