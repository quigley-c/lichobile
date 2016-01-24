import { gameIcon } from '../../utils';
import { provisionalDeviation } from '../../lichess/perfs';
import helper from '../helper';
import m from 'mithril';

module.exports = function(key, name, perf, user) {
  var options = {'class': 'perf', 'data-icon': gameIcon(key)};
  if (variantPerfAvailable(key, perf)) {
    options['class'] += ' nav';
    options.config = helper.ontouchY(goToVariantPerf(user, key));
  }

  return m('div', options, [
    m('span.name', name),
    m('div.rating', [
      perf.rating,
      perf.rd >= provisionalDeviation ? '?' : null,
      helper.progress(perf.prog),
      m('span.nb', '/ ' + perf.games)
    ])
  ]);
};

function goToVariantPerf (user, key) {
  return (() => m.route(`/@/${user.id}/${key}/perf`));
}

function variantPerfAvailable (key, perf) {
  return (key !== 'puzzle' && perf.games > 0);
}
