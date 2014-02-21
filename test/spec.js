var chai = require('chai')
  , expect = chai.expect
  , path = require('path')
  , fs = require('fs')
  , html = fs.readFileSync(path.join(__dirname, './spec.html'), 'utf8')
  , schema = require('../');

describe('schema-microdata', function() {
  it('should not throw an exception', function() {

    expect(function() {
      schema(html);
    }).not.to.throw(Error);
  });

  it('should return two items', function() {
    var res = schema(html);
    expect(res).to.have.length(7);
  });

  it('should annotate work', function() {
    var res = schema(html);
    expect(res[0]).to.eql({
      work: 'http://foolip.org/microdatajs/',
      title: 'MicrodataJS',
      author: 'Philip Jägenstedt',
      license: 'http://creativecommons.org/licenses/by/3.0/'
    });
  });
});