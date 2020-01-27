import h from 'mithril/hyperscript'
import { User } from '../interfaces'

export function userIcon(user: User, cls: string) {
  return h('div.user.' + cls, {
    className: user.online ? 'online' : 'offline',
  }, [
    h('span.userStatus', {
      className: user.patron ? 'patron' : 'fa fa-circle',
      'data-icon': user.patron ? '' : undefined
    })
  ])
}

export function userName(user: User) {
  return user.title ? [
    h(
      'span.title',
      user.title == 'BOT' ? { attrs: {'data-bot': true } } : {},
      user.title
    ), ' ', user.name
  ] : [user.name]
}
