import * as Mithril from 'mithril'
import h from 'mithril/hyperscript'
import { Msg, Daily } from '../interfaces'
import * as enhance from './enhance'
import MsgCtrl from '../MsgCtrl'

export default function renderMsgs(ctrl: MsgCtrl, msgs: Msg[]) {
  return h('div.msg-app__convo__msgs', {
    oncreate: setupMsgs,
    onupdate: setupMsgs,
  }, [
    h('div.msg-app__convo__msgs__init'),
    h('div.msg-app__convo__msgs__content', contentMsgs(ctrl, msgs))
  ])
}

function contentMsgs(ctrl: MsgCtrl, msgs: Msg[]) {
  const dailies = groupMsgs(msgs)
  const nodes: Mithril.Children = []
  dailies.forEach(daily => nodes.push(...renderDaily(ctrl, daily)))
  return nodes
}

function renderDaily(ctrl: MsgCtrl, daily: Daily) {
  return [
    h('day', renderDate(daily.date)),
    ...daily.msgs.map(group =>
      h('group', group.map(msg => renderMsg(ctrl, msg)))
    )
  ]
}

function renderMsg(ctrl: MsgCtrl, msg: Msg) {
  return h(msg.user == ctrl.data.me.id ? 'mine' : 'their', [
    renderText(msg),
    h('em', `${pad2(msg.date.getHours())}:${pad2(msg.date.getMinutes())}`)
  ])
}
function pad2(num: number): string {
  return (num < 10 ? '0' : '') + num
}

function groupMsgs(msgs: Msg[]): Daily[] {
  let prev: Msg = msgs[0]
  if (!prev) return [{ date: new Date(), msgs: [] }]
  const dailies: Daily[] = [{
    date: prev.date,
    msgs: [[prev]]
  }]
  msgs.slice(1).forEach(msg => {
    if (sameDay(msg.date, prev.date)) {
      if (msg.user == prev.user) dailies[0].msgs[0].unshift(msg)
      else dailies[0].msgs.unshift([msg])
    } else dailies.unshift({
      date: msg.date,
      msgs: [[msg]]
    })
    prev = msg
  })
  return dailies
}

const today = new Date()
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

function renderDate(date: Date) {
  if (sameDay(date, today)) return 'TODAY'
  if (sameDay(date, yesterday)) return 'YESTERDAY'
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function sameDay(d: Date, e: Date) {
  return d.getDate() == e.getDate() && d.getMonth() == e.getMonth() && d.getFullYear() == e.getFullYear()
}

function renderText(msg: Msg) {
  return enhance.isMoreThanText(msg.text) ? h('t', {
    oncreate: ({ dom }) => {
      (dom as HTMLElement).innerHTML = enhance.enhance(msg.text)
    }
  }) : h('t', msg.text)
}

function setupMsgs(vnode: Mithril.VnodeDOM<any, any>) {
  (vnode.dom as HTMLElement).scrollTop = 9999999
}
