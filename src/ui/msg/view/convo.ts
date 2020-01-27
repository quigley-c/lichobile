import h from 'mithril/hyperscript'
import { Convo } from '../interfaces'
import MsgCtrl from '../MsgCtrl'
import { userName } from './util'
import renderMsgs from './msgs'
import renderActions from './actions'
import renderTextarea from './textarea'

export default function renderConvo(ctrl: MsgCtrl, convo: Convo) {
  const user = convo.user
  return h('div.msg-app__convo', [
    h('div.msg-app__convo__head', [
      h('a.user-link.ulpt', {
        href: `/@/${user.name}`,
        className: user.online ? 'online' : 'offline',
      }, [
        h('i.line' + (user.id == 'lichess' ? '.moderator' : (user.patron ? '.patron' : ''))),
        ...userName(user)
      ]),
      h('div.msg-app__convo__head__actions', renderActions(convo))
    ]),
    renderMsgs(ctrl, convo.msgs),
    h('div.msg-app__convo__reply', [
      convo.relations.out === false || convo.relations.in === false ?
        h('div.msg-app__convo__reply__block.text', {
          attrs: { 'data-icon': 'k' }
        }, 'This conversation is blocked.') : (
          convo.postable ?
            renderTextarea() :
            h('div.msg-app__convo__reply__block.text', {
              attrs: { 'data-icon': 'k' }
            }, `${user.name} doesn't accept new messages.`)
        )
    ])
  ])
}
