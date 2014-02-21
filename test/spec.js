var chai = require('chai')
  , expect = chai.expect
  , path = require('path')
  , fs = require('fs')
  , microdataHtml = read('spec.html')
  , vimeo = read('vimeo.html')
  , schema = require('../');

function read(file) {
  return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

describe('schema-microdata', function() {
  describe('microdata html', function() {
    it('should not throw an exception', function() {
      expect(function() {
        schema(microdataHtml);
      }).not.to.throw(Error);
    });

    it('should return two items', function() {
      var res = schema(microdataHtml);
      expect(res).to.have.length(7);
    });

    it('should annotate work', function() {
      var res = schema(microdataHtml);
      expect(res[0]).to.eql({
        work: 'http://foolip.org/microdatajs/',
        title: 'MicrodataJS',
        author: 'Philip Jägenstedt',
        license: 'http://creativecommons.org/licenses/by/3.0/'
      });
    });
  });

  describe('vimeo html', function() {
    it('should not throw an exception', function() {
      expect(function() {
        schema(vimeo);
      }).not.to.throw(Error);
    });

    it('should not have a value for the property "video"', function() {
      var res = schema(vimeo);
      expect(res[0]).not.to.have.key('video');
    });
  });
});