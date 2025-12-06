import defaultMetaImage from '@/assets/images/logo-vietceramics.png'

const isDomReady = () => typeof window !== 'undefined' && typeof document !== 'undefined'

const resolveAbsoluteUrl = (value) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  try {
    return new URL(value, window.location.origin).href
  } catch (error) {
    console.warn('Cannot resolve URL for SEO meta:', value, error)
    return value
  }
}

const ensureMetaTag = (key, content, attribute = 'name') => {
  if (!isDomReady()) return
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content || '')
}

const ensureLinkTag = (rel, href) => {
  if (!isDomReady()) return
  let link = document.head.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export const updateSeoMeta = ({
  title,
  description = 'Khám phá hệ sinh thái gạch ốp lát, thiết bị vệ sinh và sàn gỗ cao cấp Vietceramics.',
  keywords = 'Vietceramics,gạch cao cấp,thiết bị vệ sinh,sàn gỗ',
  image,
  url,
  type = 'website',
  siteName = 'Vietceramics'
} = {}) => {
  if (!isDomReady()) return

  const resolvedImage = resolveAbsoluteUrl(image || defaultMetaImage)
  const resolvedUrl = resolveAbsoluteUrl(url || window.location.href)

  if (title) {
    document.title = title
  }

  ensureMetaTag('description', description)
  ensureMetaTag('keywords', keywords)

  ensureMetaTag('og:title', title || siteName, 'property')
  ensureMetaTag('og:description', description, 'property')
  ensureMetaTag('og:image', resolvedImage, 'property')
  ensureMetaTag('og:url', resolvedUrl, 'property')
  ensureMetaTag('og:type', type, 'property')
  ensureMetaTag('og:site_name', siteName, 'property')

  ensureMetaTag('twitter:card', 'summary_large_image')
  ensureMetaTag('twitter:title', title || siteName)
  ensureMetaTag('twitter:description', description)
  ensureMetaTag('twitter:image', resolvedImage)

  ensureLinkTag('canonical', resolvedUrl)
}
