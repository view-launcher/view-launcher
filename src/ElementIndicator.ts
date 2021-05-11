import Mousetrap from 'mousetrap'
import { Editor, editorUrl } from './editorUrl'
import { closestComponent, closestInspectableElement, html } from './utils'
import { createPopper, Instance as PopperInstance } from '@popperjs/core'

export type Options = {
  /**
   * The color theme to be used.
   */
  theme: 'dark' | 'light'

  /**
   * The editor you'd like to use.
   */
  editor: Editor

  /**
   * The shortcuts settings.
   * see the link below for the possible values.
   * @link https://github.com/ccampbell/mousetrap
   */
  shortcuts: {
    /**
     * Open the editor.
     */
    open: string

    /**
     * Toggle inspect mode.
     */
    inspect: string

    /**
     * Toggle inspect mode, but only inspect components.
     */
    inspectComponent: string

    /**
     * Inspect the parent element of current inspecting element.
     */
    inspectParent: string
  }
}

export type TagInfo = {
  /**
   * The absolute path of the view file.
   */
  view: string

  /**
   * The line number of the element.
   */
  line: number

  /**
   * The column number of the element.
   */
  column?: number

  /**
   * If the element is the root element of a component,
   * set this to the component's name, otherwise undefined.
   */
  component?: string
}

export type InspectableElement = Element & { tagInfo: TagInfo }

export const defaultOptions: Options = {
  theme: 'light',
  editor: 'vscode',
  shortcuts: {
    open: 'd',
    inspect: 'a a',
    inspectComponent: 'c c',
    inspectParent: 'e',
  },
}

export class ElementIndicator {
  private readonly options: Options
  private _enabled = false
  private inspectComponentOnly = false
  private indicator!: HTMLElement
  private tooltip!: HTMLElement
  private tagInfo!: HTMLElement
  private viewName!: HTMLElement
  private popper!: PopperInstance
  private element?: InspectableElement
  private static instance: ElementIndicator

  private constructor(userOptions: Partial<Options>) {
    this.options = { ...defaultOptions, ...userOptions }

    this.createElements()
    this.addEventListeners()
    this.registerHotkeys()
    this.keepUpdatingOnEvents()
  }

  private createElements() {
    const { theme } = this.options
    const bodyElement = document.body
    const indicator = html(
      `<div id="view-launcher-indicator" class="--${theme}" style="visibility: hidden"></div>`
    ) as HTMLElement
    const tooltip = html(`<div id="view-launcher-tooltip" class="--${theme}" style="visibility: hidden">
<div class="__tag-info"></div>
<div class="__view-name"></div>
</div>`) as HTMLElement
    const tagInfo = tooltip.querySelector('.__tag-info') as HTMLElement
    const viewName = tooltip.querySelector('.__view-name') as HTMLElement

    bodyElement.appendChild(indicator)
    bodyElement.appendChild(tooltip)

    this.popper = createPopper(indicator, tooltip, {
      placement: 'top-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 5],
          },
        },
        { name: 'eventListeners', enabled: false },
      ],
    })

    this.indicator = indicator
    this.tooltip = tooltip
    this.tagInfo = tagInfo
    this.viewName = viewName
  }

  private addEventListeners() {
    const elements = Array.from(document.querySelectorAll('[data-tag-info]')).filter((element) => {
      ;(element as InspectableElement).tagInfo = JSON.parse((element as any).dataset.tagInfo)
      element.removeAttribute('data-tag-info')

      const invisibleTags = [
        'HTML',
        'HEAD',
        'BODY',
        'SCRIPT',
        'NOSCRIPT',
        'META',
        'LINK',
        'STYLE',
        'TITLE',
        'BASE',
      ]
      const computedStyle = getComputedStyle(element)

      return !(
        invisibleTags.includes(element.tagName) ||
        computedStyle.display === 'none' ||
        computedStyle.visibility === 'hidden'
      )
    })

    elements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        const isComponent = !!(element as InspectableElement).tagInfo.component

        if (!this.inspectComponentOnly || isComponent) {
          this.setElement(element as InspectableElement)
          return
        }

        const component = closestComponent(element)
        if (!component) {
          return
        }
        this.setElement(component)
      })

      element.addEventListener('mouseleave', (event) => {
        const relatedTarget = (event as MouseEvent).relatedTarget

        if (!(relatedTarget instanceof Element)) {
          return
        }

        const closestTag = this.inspectComponentOnly
          ? closestComponent(relatedTarget)
          : closestInspectableElement(relatedTarget)

        if (closestTag) {
          this.setElement(closestTag)
        }
      })
    })
  }

  private registerHotkeys() {
    const { shortcuts, editor } = this.options

    Mousetrap.bind(shortcuts.inspect, () => {
      this.inspectComponentOnly = false
      this.toggleEnable()
    })

    Mousetrap.bind(shortcuts.inspectComponent, () => {
      this.inspectComponentOnly = true
      this.toggleEnable()
    })

    Mousetrap.bind(shortcuts.open, () => {
      if (!this.enabled || !this.element) {
        return
      }

      const tagInfo = this.element.tagInfo
      window.location.href = editorUrl({
        editor,
        viewPath: tagInfo.view,
        line: tagInfo.line,
        column: tagInfo.column,
      })
    })

    Mousetrap.bind(shortcuts.inspectParent, () => {
      if (!this.element?.parentElement) {
        return
      }

      const closestTag = closestInspectableElement(this.element.parentElement)

      if (closestTag) {
        this.setElement(closestTag)
      }
    })

    Mousetrap.bind('esc', () => {
      this.disable()
    })
  }

  private keepUpdatingOnEvents() {
    // update on window scroll and resize
    window.addEventListener('scroll', this.update.bind(this))
    window.addEventListener('resize', this.update.bind(this))

    // update on document mutation
    const targetNode = document.body
    const config = { attributes: false, childList: true, subtree: true }
    const observer = new MutationObserver(() => {
      this.addEventListeners()
    })

    observer.observe(targetNode, config)
  }

  static create(options: Partial<Options> = {}): ElementIndicator {
    if (ElementIndicator.instance) {
      return ElementIndicator.instance
    }

    const instance = new ElementIndicator(options)

    return (ElementIndicator.instance = instance)
  }

  setElement(element: InspectableElement) {
    this.element = element

    this.update()
  }

  update() {
    const element = this.element
    if (!element || this.disabled) {
      return
    }

    const indicatorStyle = this.indicator.style
    const rect = element.getBoundingClientRect()
    const windowHeight = document.documentElement.clientHeight
    const overflowWinBottom = rect.top + rect.height > windowHeight
    const height =
      rect.top > 0
        ? overflowWinBottom
          ? windowHeight - rect.top
          : rect.height
        : overflowWinBottom
        ? windowHeight
        : rect.height + rect.top

    indicatorStyle.width = rect.width + 'px'
    indicatorStyle.height = height + 'px'
    indicatorStyle.left = rect.left + 'px'
    indicatorStyle.top = (rect.top > 0 ? rect.top : 0) + 'px'

    const classes = Array.from(element.classList).join('.')
    const tagName = element.tagName.toLowerCase()
    const viewName = element.tagInfo.view.match(/[^/\\]+?$/)![0]

    const tagSelector = element.tagInfo.component || `${tagName}${classes ? '.' + classes : ''}`
    const isComponentIcon = element.tagInfo.component ? `<i class="__is-component"></i>` : ''

    this.tagInfo.innerHTML = isComponentIcon + tagSelector
    this.viewName.innerText = viewName

    this.popper.setOptions({
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: overflowWinBottom && rect.top < 0 ? [6, -(this.tooltip.clientHeight + 5)] : [0, 5],
          },
        },
      ],
    })
    this.popper.update()
  }

  setPopperEventListeners(enabled: boolean) {
    this.popper.setOptions({
      modifiers: [{ name: 'eventListeners', enabled }],
    })
  }

  hide() {
    ;[this.indicator, this.tooltip].forEach((elem) => {
      elem.style.visibility = 'hidden'
    })
  }

  show() {
    ;[this.indicator, this.tooltip].forEach((elem) => {
      elem.style.visibility = 'visible'
    })
  }

  enable() {
    this._enabled = true
    this.setPopperEventListeners(true)
    this.update()
    this.show()
  }

  disable() {
    this._enabled = false
    this.element = undefined
    this.setPopperEventListeners(false)
    this.hide()
  }

  get enabled() {
    return this._enabled
  }

  get disabled() {
    return !this._enabled
  }

  toggleEnable() {
    this.enabled ? this.disable() : this.enable()
  }
}
