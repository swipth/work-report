import {nextTick, onMounted, watch} from 'vue'
import type {RouteLocationNormalizedLoaded} from 'vue-router'

const MIN_SCALE = 0.5
const MAX_SCALE = 4
const SCALE_STEP = 0.25

let overlay: HTMLDivElement | null = null
let viewportEl: HTMLDivElement | null = null
let stageEl: HTMLDivElement | null = null
let scalerEl: HTMLDivElement | null = null
let contentEl: HTMLDivElement | null = null
let baseWidth = 0
let baseHeight = 0
let currentScale = 1
let boundRoot: Element | null = null
let clickHandler: ((event: Event) => void) | null = null
let keyHandler: ((event: KeyboardEvent) => void) | null = null

function applyScale() {
    if (!scalerEl || !contentEl || baseWidth <= 0 || baseHeight <= 0) return

    scalerEl.style.width = `${baseWidth * currentScale}px`
    scalerEl.style.height = `${baseHeight * currentScale}px`
    contentEl.style.width = `${baseWidth}px`
    contentEl.style.height = `${baseHeight}px`
    contentEl.style.transform = `scale(${currentScale})`
}

function centerViewportScroll() {
    if (!viewportEl) return
    requestAnimationFrame(() => {
        const maxScrollLeft = Math.max(0, viewportEl!.scrollWidth - viewportEl!.clientWidth)
        const maxScrollTop = Math.max(0, viewportEl!.scrollHeight - viewportEl!.clientHeight)
        viewportEl!.scrollLeft = maxScrollLeft / 2
        viewportEl!.scrollTop = maxScrollTop / 2
    })
}

function ensureOverlay() {
    if (overlay && viewportEl && stageEl && scalerEl && contentEl) return

    overlay = document.createElement('div')
    overlay.className = 'mermaid-preview-overlay'
    overlay.innerHTML = `
    <div class="mermaid-preview-backdrop" data-action="close"></div>
    <div class="mermaid-preview-panel" role="dialog" aria-modal="true" aria-label="Mermaid 图表预览">
      <div class="mermaid-preview-toolbar">
        <button type="button" data-action="zoom-in" title="放大">+</button>
        <button type="button" data-action="zoom-out" title="缩小">−</button>
        <button type="button" data-action="reset" title="重置">1:1</button>
        <button type="button" data-action="close" title="关闭 (Esc)">✕</button>
      </div>
      <div class="mermaid-preview-viewport">
        <div class="mermaid-preview-stage">
          <div class="mermaid-preview-scaler">
            <div class="mermaid-preview-content"></div>
          </div>
        </div>
      </div>
    </div>
  `
    document.body.appendChild(overlay)

    viewportEl = overlay.querySelector('.mermaid-preview-viewport') as HTMLDivElement
    stageEl = overlay.querySelector('.mermaid-preview-stage') as HTMLDivElement
    scalerEl = overlay.querySelector('.mermaid-preview-scaler') as HTMLDivElement
    contentEl = overlay.querySelector('.mermaid-preview-content') as HTMLDivElement

    overlay.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        const action = target.closest('[data-action]')?.getAttribute('data-action')
        if (!action) return
        event.preventDefault()
        if (action === 'close') closePreview()
        if (action === 'zoom-in') {
            currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP)
            applyScale()
            centerViewportScroll()
        }
        if (action === 'zoom-out') {
            currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP)
            applyScale()
            centerViewportScroll()
        }
        if (action === 'reset') {
            currentScale = 1
            applyScale()
            centerViewportScroll()
        }
    })

    viewportEl.addEventListener(
        'wheel',
        (event) => {
            if (!overlay?.classList.contains('is-open')) return
            event.preventDefault()
            const delta = event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
            currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentScale + delta))
            applyScale()
            centerViewportScroll()
        },
        {passive: false},
    )
}

function measureBaseSize(svg: SVGSVGElement) {
    const rect = svg.getBoundingClientRect()
    baseWidth = Math.ceil(rect.width) || svg.clientWidth || 800
    baseHeight = Math.ceil(rect.height) || svg.clientHeight || 600
}

function openPreview(source: HTMLElement) {
    const svg = source.querySelector('svg')
    if (!svg) return

    ensureOverlay()
    if (!contentEl) return

    contentEl.innerHTML = ''
    const clone = svg.cloneNode(true) as SVGSVGElement
    clone.style.maxWidth = 'none'
    clone.style.width = '100%'
    clone.style.height = 'auto'
    clone.style.display = 'block'
    contentEl.appendChild(clone)

    currentScale = 1
    requestAnimationFrame(() => {
        measureBaseSize(clone)
        applyScale()
        centerViewportScroll()
    })

    overlay?.classList.add('is-open')
    document.body.classList.add('mermaid-preview-open')
}

function closePreview() {
    overlay?.classList.remove('is-open')
    document.body.classList.remove('mermaid-preview-open')
}

function markZoomableCharts(root: Element) {
    root.querySelectorAll('.mermaid').forEach((node) => {
        if (node.querySelector('svg')) {
            node.classList.add('mermaid-zoomable')
        } else {
            node.classList.remove('mermaid-zoomable')
        }
    })
}

function bindMermaidPreview() {
    const root = document.querySelector('.vp-doc')
    if (!root) return

    if (boundRoot && clickHandler) {
        boundRoot.removeEventListener('click', clickHandler)
    }

    clickHandler = (event: Event) => {
        const block = (event.target as Element).closest('.mermaid.mermaid-zoomable')
        if (!block || !root.contains(block)) return
        event.preventDefault()
        openPreview(block as HTMLElement)
    }

    root.addEventListener('click', clickHandler)
    boundRoot = root
    markZoomableCharts(root)

    window.setTimeout(() => markZoomableCharts(root), 300)
    window.setTimeout(() => markZoomableCharts(root), 1200)
}

function bindEscapeClose() {
    if (keyHandler) return
    keyHandler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') closePreview()
    }
    document.addEventListener('keydown', keyHandler)
}

export function setupMermaidPreview(route: RouteLocationNormalizedLoaded) {
    onMounted(() => {
        ensureOverlay()
        bindEscapeClose()
        bindMermaidPreview()
    })

    watch(
        () => route.path,
        () =>
            nextTick(() => {
                bindMermaidPreview()
            }),
    )
}
