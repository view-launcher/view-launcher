import { ElementHasTagInfo } from './ElementIndicator'

export function closest(element: Element, filter: (element: Element) => boolean): Element | null {
  if (!element.parentElement) {
    return null
  }

  if (!filter(element)) {
    return closest(element.parentElement, filter)
  }

  return element
}

export function closestInspectableElement(element: Element): ElementHasTagInfo | null {
  return closest(element, (element) => element.hasOwnProperty('tagInfo')) as ElementHasTagInfo | null
}

export function el(tagName: string): HTMLElement {
  return document.createElement(tagName)
}

export function html(html: string): Element | Element[] {
  const wrapper = el('div')
  wrapper.innerHTML = html

  if (wrapper.childElementCount === 0) {
    throw new Error(`Couldn't create elements from '${html}'`)
  }

  if (wrapper.childElementCount === 1) {
    return wrapper.firstElementChild as Element
  }

  return Array.from(wrapper.children)
}
