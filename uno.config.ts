import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  shortcuts: {
     'flex-center': 'flex justify-center items-center',
  },
  content: {
    filesystem: ['src/**/*.{html,ts}'],
  },
})