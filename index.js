var _ = require('lodash')
  , cheerio = require('cheerio');

function lookup(el) {
  // XXX Hack
  return el.__item__ = el.__item__ || {};
}

function closestItemscope(el) {
  while(el && ! _.has(el.attribs, 'itemscope'))
    el = el.parent;
  return el;
}

function value(el) {
  var val;
  switch(el[0].name) {
  case 'meta':
    val = el.attr('content');
    break;
  case 'a':
  case 'area':
  case 'link':
    val = el.attr('href');
    break;
  case 'audio':
  case 'video':
  case 'iframe':
  case 'img':
  case 'embed':
  case 'source':
  case 'track':
    val = el.attr('src');
    break;
  case 'object':
    val = el.attr('data');
    break;
  default:
    val = el.text().trim();
    break;
  }
  return val;
}

module.exports = function($) {
  if(typeof $ === 'string') {
    $ = cheerio.load($);
  }

  var root = [];
  $('[itemscope],[itemprop]').each(function(i, el) {
    var container = closestItemscope(el)
    if(! container)
      return;

    var item = lookup(container)
      , name = el.attribs.itemprop;

    // XXX Technically this is wrong, but it is much faster
    // than a true .is() check.  For our purposes here,
    // it should always be correct.
    if(el === container) {
      var parent = closestItemscope(container.parent);
      item._type = el.attribs.itemtype;
      if(parent) {
        var parentItem = lookup(parent);
        parentItem[name] = (parentItem[name] || []).concat(item);
      } else
        root.push(item);
    } else if(name) {
      item[name] = value($(el));
    }
  });

  return _.uniq(root);
};