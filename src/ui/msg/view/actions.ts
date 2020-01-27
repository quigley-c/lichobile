import h from 'mithril/hyperscript'
// import i18n from '../../../i18n'
import { Convo } from '../interfaces'
// import MsgCtrl from '../MsgCtrl'

export default function renderActions(convo: Convo) {
  if (convo.user.id == 'lichess') return []
  const nodes = []
  const cls = 'msg-app__convo__action.button.button-empty'
  nodes.push(
    h(`a.${cls}.play`, {
      'data-icon': 'U',
      // href: `/?user=${convo.user.name}#friend`,
      // title: i18n('challengeToPlay')
    })
  )
  nodes.push(h('div.msg-app__convo__action__sep', '|'))
  if (convo.relations.out === false) nodes.push(
    h(`button.${cls}.text.hover-text`, {
      'data-icon': 'k',
      // title: ctrl.trans.noarg('blocked'),
      // 'data-hover-text': ctrl.trans.noarg('unblock'),
      // hook: bind('click', ctrl.unblock),
    })
  )
  else nodes.push(
    h(`button.${cls}.bad`, {
      'data-icon': 'k',
      // title: ctrl.trans.noarg('block')
      // hook: bind('click', withConfirm(ctrl.block))
    })
  )
  nodes.push(
    h(`button.${cls}.bad`, {
      'data-icon': 'q',
      // title: ctrl.trans.noarg('delete'),
      // hook: bind('click', withConfirm(ctrl.delete))
    })
  )
  nodes.push(
    h(`button.${cls}.bad`, {
      'data-icon': '!',
      // href: '/report/flag',
      // title: ctrl.trans('reportXToModerators', convo.user.name)
    })
  )
  return nodes
}

// const withConfirm = (f: () => void) => (e: MouseEvent) => {
//   if (confirm(`${(e.target as HTMLElement).getAttribute('title') || 'Confirm'}?`)) f()
// }
