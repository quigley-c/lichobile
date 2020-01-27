import h from 'mithril/hyperscript'

export default function renderTextarea() {
  return h('textarea.msg-app__convo__reply__text', {
    attrs: {
      rows: 1,
      autofocus: 1
    },
  })
}
