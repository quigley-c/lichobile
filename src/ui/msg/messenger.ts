import h from 'mithril/hyperscript'
import * as Mithril from 'mithril'
import { header, connectingHeader } from '../shared/common'
import * as helper from '../helper'
import layout from '../layout'
import MsgCtrl from './MsgCtrl'
import * as network from './network'
import renderContact from './view/contact'
import * as search from './view/search'

interface State {
  ctrl?: MsgCtrl
}

export default {
  oncreate: helper.viewFadeIn,
  oninit() {
    network.loadContacts()
    .then(data => {
      this.ctrl = new MsgCtrl(data)
    })
  },

  view() {
    if (!this.ctrl) {
      return layout.free(connectingHeader('Messenger'), null)
    }

    const content = h('div.msg-app', [
      search.renderInput(this.ctrl),
      this.ctrl.searchRes ?
        search.renderResults(this.ctrl, this.ctrl.searchRes) :
        h('div.msg-app__contacts',
          this.ctrl.data.contacts.map(t => renderContact(this.ctrl!, t))
        )
    ])

    return layout.free(header('Messenger'), content)
  }

} as Mithril.Component<{}, State>
