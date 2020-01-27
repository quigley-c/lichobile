import * as Mithril from 'mithril'
import { loadingBackbutton, backButton } from '../shared/common'
import * as helper from '../helper'
import layout from '../layout'
import MsgCtrl from './MsgCtrl'
import * as network from './network'
import renderConvo from './view/convo'

interface Attrs {
  userId: string
}

interface State {
  ctrl?: MsgCtrl
}

export default {
  oncreate: helper.viewFadeIn,
  oninit({ attrs }) {
    network.loadConvo(attrs.userId)
    .then(data => {
      this.ctrl = new MsgCtrl(data)
    })
  },

  view({ attrs }) {
    if (!this.ctrl) {
      return layout.free(loadingBackbutton(attrs.userId), null)
    }

    const header = backButton(attrs.userId)
    const content = this.ctrl.data.convo ? renderConvo(this.ctrl, this.ctrl.data.convo) : null
    return layout.free(header, content)
  }

} as Mithril.Component<Attrs, State>
