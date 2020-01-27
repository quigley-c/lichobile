import { fetchJSON, fetchText } from '../../http'
import socket, { MessageHandlers } from '../../socket'

import MsgCtrl from './MsgCtrl'
import { MsgData, Contact, User, Msg, Convo, SearchRes } from './interfaces'

const cache: RequestCache = 'no-cache'

export function loadConvo(userId: string): Promise<MsgData> {
  return fetchJSON(`/inbox/${userId}`, { cache })
  .then(upgradeData)
}

export function loadContacts(): Promise<MsgData> {
  return fetchJSON(`/inbox`, { cache })
  .then(upgradeData)
}

export function search(q: string): Promise<SearchRes> {
  return fetchJSON<SearchRes>(`/inbox/search?q=${q}`)
  .then(res => ({
    ...res,
    contacts: res.contacts.map(upgradeContact)
  } as SearchRes))
}

export function block(u: string) {
  return fetchText(`/rel/block/${u}`, {
    method: 'POST',
  })
}

export function unblock(u: string) {
  return fetchText(`/rel/unblock/${u}`, {
    method: 'POST',
  })
}

export function del(u: string): Promise<MsgData> {
  return fetchJSON(`/inbox/${u}`, {
    method: 'DELETE',
  })
  .then(upgradeData)
}

export function post(dest: string, text: string) {
  socket.sendNoCheck('msgSend', { dest, text })
}

export function setRead(dest: string) {
  socket.sendNoCheck('msgRead', dest)
}

export function websocketHandler(ctrl: MsgCtrl): MessageHandlers {
  return {
    msgNew: msg => { ctrl.receive({
      ...upgradeMsg(msg),
      read: false
    })
    },
    blockedBy: ctrl.changeBlockBy,
    unblockedBy: ctrl.changeBlockBy,
  }
}

// the upgrade functions convert incoming timestamps into JS dates
export function upgradeData(d: any): MsgData {
  return {
    ...d,
    convo: d.convo && upgradeConvo(d.convo),
    contacts: d.contacts.map(upgradeContact)
  }
}

function upgradeMsg(m: any): Msg {
  return {
    ...m,
    date: new Date(m.date)
  }
}
function upgradeUser(u: any): User {
  return {
    ...u,
    id: u.name.toLowerCase()
  }
}
function upgradeContact(c: any): Contact {
  return {
    ...c,
    user: upgradeUser(c.user),
    lastMsg: upgradeMsg(c.lastMsg)
  }
}
function upgradeConvo(c: any): Convo {
  return {
    ...c,
    user: upgradeUser(c.user),
    msgs: c.msgs.map(upgradeMsg)
  }
}
