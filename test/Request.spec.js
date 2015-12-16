'use strict';

/*global describe, it*/

const MWBot = require('../src/');
const log = require('semlog').log;

const chai = require('chai');
const expect = chai.expect;


const loginCredentials = require('./mocking/loginCredentials.json');

describe('MWBot Request', function() {


    //////////////////////////////////////////
    // SUCESSFULL                           //
    //////////////////////////////////////////


    it('successfully editing a page with request()', function(done) {
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.request({
                action: 'edit',
                title: 'Main_Page',
                text: '=Some Wikitext 2=',
                summary: 'Test Edit',
                token: bot.editToken
            });

        }).then((response) => {
            expect(response.edit.result).to.equal('Success');
            done();
        });
    });


    it('successfully creates a page with create()', function(done) {
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.create('Test Page', '=Some more Wikitext=', 'Test Upload');
        }).then((response) => {
            expect(response.edit.result).to.equal('Success');
            done();
        });
    });

    it('successfully reads a page read()', function(done) {
        let bot = new MWBot();
        bot.login(loginCredentials.valid).then(() => {
            return bot.read('Main Page');
        }).then((response) => {
            expect(response).to.have.any.keys('query');
            expect(response.query).to.have.any.keys('pages');
            done();
        });
    });

    it('successfully updates a page with update()', function(done) {
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.update('Test Page', '=Some more Wikitext=', 'Test Upload');
        }).then(() => {
            return bot.update('Test Page', '=Some more Wikitext=');
        }).then((response) => {
            expect(response.edit.result).to.equal('Success');
            expect(bot.counter.fulfilled).to.equal(5);
            done();
        });
    });


    it('successfully editing a page with edit()', function(done) {
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.edit('Test Page', '=Some more Wikitext=', 'Some summary');
        }).then(() => {
            return bot.edit('Test Page', '=Some more Wikitext=');
        }).then((response) => {
            expect(response.edit.result).to.equal('Success');
            done();
        });
    });


    it('successfully deletes a page with delete()', function(done) {
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.delete('Test Page', 'Test Reasons');
        }).then((response) => {
            expect(response.delete.logid).to.be.a.number;
            done();
        });
    });

    it('successfully uploads and overwrites an image with upload()', function(done) {
        this.timeout(3000);
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.upload(__dirname + '/mocking/ExampleImage.png', 'ExampleImage.png', 'Test Reasons', true);
        }).then((response) => {
            expect(response.upload.result).to.equal('Success');
            done();
        });
    });

    it('successfully uploads without providing a filename with upload()', function(done) {
        this.timeout(3000);
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.upload(__dirname + '/mocking/ExampleImage.png');
        }).then((response) => {
            expect(response.upload.result).to.equal('Warning');
            done();
        }).catch((e) => {
            log(e);
        });
    });

    it('successfully skips an upload of an image duplicate with upload()', function(done) {
        this.timeout(3000);
        let bot = new MWBot();
        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.upload(__dirname + '/mocking/ExampleImage.png', 'ExampleImage.png', 'Test Reasons', false);
        }).then((response) => {
            expect(response.upload.result).to.equal('Warning');
            done();
        });
    });


    //////////////////////////////////////////
    // UNSUCESSFULL                         //
    //////////////////////////////////////////

    it('rejects deleting a non-existing page with delete()', function(done) {

        let bot = new MWBot();

        bot.loginGetEditToken(loginCredentials.valid).then(() => {
            return bot.delete('Non-Existing Page', 'Test Reasons');
        }).catch((err) => {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.include('missingtitle');
            done();
        });
    });



    it('cannot edit a page without providing API URL / Login', function(done) {
        new MWBot().edit('Main Page', '=Some more Wikitext=', 'Test Upload').catch((err) => {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.include('No API URL');
            done();
        });
    });

});
