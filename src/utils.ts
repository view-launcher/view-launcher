import { InspectableElement } from './ElementIndicator'

type ElementFilter<E extends Element = Element> = (element: E) => boolean

export function isInspectableElement(element: Element): element is InspectableElement {
  return element.hasOwnProperty('tagInfo')
}

export function closest(element: Element, filter: ElementFilter): Element | null {
  if (!element.parentElement) {
    return null
  }

  if (!filter(element)) {
    return closest(element.parentElement, filter)
  }

  return element
}

export function closestInspectableElement(
  element: Element,
  filter: ElementFilter<InspectableElement> = () => true
): InspectableElement | null {
  return closest(
    element,
    (element) => isInspectableElement(element) && filter(element)
  ) as InspectableElement | null
}

export function closestComponent(element: Element): InspectableElement | null {
  return closestInspectableElement(
    element,
    (element) => !!element.tagInfo.component
  ) as InspectableElement | null
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
