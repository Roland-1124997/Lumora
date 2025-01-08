// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: false,

    timeline: {
      enabled: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/test-utils',
    '@nuxt/icon',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "nuxt-scheduler"
  ],

  runtimeConfig: {
    ServerUrl: process.env.SERVER_URL,
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    }
  },

  supabase: {
    redirect: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
      },
    }
  },

  routeRules: {
    "/moments/**": { ssr: false },
    "/auth/**": { ssr: true },
    "/**": { ssr: true },
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

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: "#FFFFFF" },
        // { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
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
