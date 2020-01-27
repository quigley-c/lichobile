import { linkify } from '../../../utils/html'

export function enhance(text: string): string {
  return nl2br(linkify(text))
}

export function isMoreThanText(str: string) {
  return moreThanTextPattern.test(str) || possibleLinkPattern.test(str)
}

const moreThanTextPattern = /[&<>"@\n]/
const possibleLinkPattern = /\.\w/

function nl2br(html: string) {
  return html.replace(/\n/g, '<br>')
}
