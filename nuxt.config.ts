// https://nuxt.com/docs/api/configuration/nuxt-config

import path from 'path'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    "@vee-validate/nuxt",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "nuxt-charts",
    "nuxt-email-renderer"
  ],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  runtimeConfig: {
    build: process.env.NODE_ENV !== "development",
    ServerUrl: process.env.SERVER_URL,
    render: {
      key: process.env.RENDER_API_KEY,
      resource: process.env.RENDER_RESOURCE,
      uri: process.env.RENDER_URI
    },
    email: {
      key: process.env.RESEND_API_KEY,
      sender: process.env.EMAIL_FROM_ADDRESS
    },
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    public: {
      build: process.env.NODE_ENV !== "development",
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    },
    rateLimit: {
      routes: {
        '/api/moments/invitations/*': {
          methods: ['POST'],
          maxRequests: 5,
          intervalSeconds: 30,
        },
        '/api/moments/logbook/[group_id]': {
          methods: ["GET"],
          maxRequests: 30,
          intervalSeconds: 30,
        },
        '/api/moments/members/[group_id]': {
          methods: ["GET"],
          maxRequests: 30,
          intervalSeconds: 30,
        },
        '/api/moments/invitations/[group_id]': {
          methods: ["GET"],
          maxRequests: 30,
          intervalSeconds: 30,
        },
        '/api/moments/settings/[group_id]': {
          methods: ["GET"],
          maxRequests: 30,
          intervalSeconds: 30,
        },
        '/api/moments/[group_id]': {
          methods: ['POST'],
          maxRequests: 5,
          intervalSeconds: 30,
        },
        '/api/moments/[group_id]/[image_id]': {
          methods: ["*"],
          maxRequests: 15,
          intervalSeconds: 30,
        },
        '/api/auth/forgot/': {
          methods: ["POST"],
          maxRequests: 5,
          intervalSeconds: 60 * 60,
        },
        '/api/moments/': {
          methods: ["POST"],
          maxRequests: 2,
          intervalSeconds: 30,
        },
        '/api/auth/*': {
          methods: ["POST"],
          maxRequests: 6,
          intervalSeconds: 60,
        },
        '/api/users/': {
          methods: ['GET'],
          maxRequests: 120,
          intervalSeconds: 60,
        },

      }
    }
  },

  supabase: {
    redirect: false,
    cookiePrefix: "access-token",
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      httpOnly: true,
      secure: false
    },
    types: path.resolve(process.cwd(), "server/utils/supabase/types/database.types.ts")
  },

  routeRules: {
    "/moments/**": { ssr: false },
    "/monitor": { ssr: false },
    "/notifications": { ssr: false },
    "/account": { ssr: false }
  },

  veeValidate: {
    autoImports: true,
  },

  icon: {
    clientBundle: {
      scan: true,
    }
  },

  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "Lumora",
      short_name: "Lumora",
      description: "Lumora is een portfolio website voor het tonen van projecten.",
      prefer_related_applications: true,
      orientation: "portrait",
      background_color: "#FFFFFF",
      start_url: "/",
      scope: "/",
      theme_color: "#FFFFFF",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      icons: [
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
  },

  css: [
    '@/assets/css/tailwind.css'
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: "#FFFFFF" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: "Lumora" },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/png', href: '/icons/icon_144.png' },
      ],
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },
})