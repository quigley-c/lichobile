import h from 'mithril/hyperscript'
import { fromNow } from '../../../i18n'
import * as helper from '../../helper'
import { Contact, LastMsg } from '../interfaces'
import MsgCtrl from '../MsgCtrl'
import { userName, userIcon } from './util'

export default function renderContact(ctrl: MsgCtrl, contact: Contact) {
  const user = contact.user, msg = contact.lastMsg
  return h('div.msg-app__contact.list_item', {
    key: user.id,
    className: helper.classSet({
      new: !msg.read && msg.user != ctrl.data.me.id,
    }),
    oncreate: helper.ontouch(() => ctrl.openConvo(user.id)),
  }, [
    userIcon(user, 'msg-app__contact__icon'),
    h('div.msg-app__contact__user', [
      h('div.msg-app__contact__head', [
        h('div.msg-app__contact__name', userName(user)),
        h('div.msg-app__contact__date', renderDate(msg))
      ]),
      h('div.msg-app__contact__msg', msg.text)
    ])
  ])
}

function renderDate(msg: LastMsg) {
  return h('time', {
    // title: msg.date.toLocaleString(),
  }, fromNow(msg.date))
}
