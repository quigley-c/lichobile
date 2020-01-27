import throttle from 'lodash-es/throttle'
import h from 'mithril/hyperscript'
import MsgCtrl from '../MsgCtrl'
import { SearchRes, User } from '../interfaces'
import renderContacts from './contact'
import { userName, userIcon } from './util'

export function renderInput(ctrl: MsgCtrl) {
  return h('div.msg-app__side__search', [
    h('input', {
      placeholder: 'Search or start new discussion',
      oninput: throttle((e: Event) => {
        const term = (e.target as HTMLInputElement).value.trim()
        ctrl.search(term)
      }, 500),
    })
  ])
}

export function renderResults(ctrl: MsgCtrl, res: SearchRes) {
  return h('div.msg-app__search.msg-app__side__content', [
    res.contacts[0] && h('section', [
      h('h2', 'Discussions'),
      h('div.msg-app__search__contacts', res.contacts.map(t => renderContacts(ctrl, t)))
    ]),
    res.friends[0] && h('section', [
      h('h2', 'Friends'),
      h('div.msg-app__search__users', res.friends.map(u => renderUser(u)))
    ]),
    res.users[0] && h('section', [
      h('h2', 'Players'),
      h('div.msg-app__search__users', res.users.map(u => renderUser(u)))
    ])
  ])
}

function renderUser(user: User) {
  return h('div.msg-app__contact', {
    key: user.id,
  }, [
    userIcon(user, 'msg-app__contact__icon'),
    h('div.msg-app__contact__user', [
      h('div.msg-app__contact__head', [
        h('div.msg-app__contact__name', userName(user))
      ])
    ])
  ])
}
