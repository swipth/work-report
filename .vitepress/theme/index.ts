import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {useRoute} from 'vitepress'
import 'viewerjs/dist/viewer.min.css'
import imageViewer from 'vitepress-plugin-image-viewer'

import './custom.css'

export default {
    extends: DefaultTheme,
    setup() {
        const route = useRoute()
        imageViewer(route, '.vp-doc')
    },
} satisfies Theme
